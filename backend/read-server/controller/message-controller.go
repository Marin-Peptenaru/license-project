package controller

import (
	"commons/domain"
	commonservices "commons/service"
	"commons/utils"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"read-server/controller/sse"
	"read-server/service"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/gorilla/websocket"
)

const (
	wsWriteTimeout    = 200 * time.Millisecond
	wsTokenWaitTimout = 1 * time.Second
)

type MessageController interface {
	ListenForMessagesSSE(w http.ResponseWriter, r *http.Request)
	ListenForMessagesWS(w http.ResponseWriter, r *http.Request)
	FetchMessages(w http.ResponseWriter, r *http.Request)
}

type msgController struct {
	upgrader    websocket.Upgrader
	msgListener service.MessageListener
	msgService  commonservices.MessageService
}

func waitForToken(conn *websocket.Conn) string {

	var token string
	err := conn.SetReadDeadline(time.Now().Add(wsTokenWaitTimout))

	if err != nil {
		fmt.Printf("could not set read deadline: %s\n", err.Error())
		return ""
	}

	_, msg, err := conn.ReadMessage()

	if err != nil {
		fmt.Printf("error while wainting for token: %s \n", err.Error())
		return ""
	}

	token = string(msg)

	return token

}

func writeToWs(conn *websocket.Conn, msg any) {

	err := conn.SetWriteDeadline(time.Now().Add(wsWriteTimeout))

	if err != nil {
		fmt.Printf("error setting ws write timeout %s\n", err.Error())
	}

	jsonMsg, err := json.Marshal(msg)

	err = conn.WriteMessage(websocket.TextMessage, jsonMsg)

	if err != nil {
		fmt.Printf("error writing to ws: %s\n", err.Error())
	}

}

func (m msgController) ListenForMessagesWS(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("auth")
	parsedToken, err := jwtauth.VerifyToken(utils.JwtToken, token)

	if err != nil {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	conn, err := m.upgrader.Upgrade(w, r, nil)

	if err != nil {
		fmt.Println(">>>>>>>>>> err: " + err.Error())
	}

	defer func(conn *websocket.Conn) {
		err := conn.Close()
		if err != nil {
			fmt.Println("Error closing ws connection: " + err.Error())
		}
	}(conn)

	userId, ok := parsedToken.Get("user_id")

	if !ok {
		writeToWs(conn, "missing user_id claim")
		err := conn.Close()
		if err != nil {
			fmt.Printf("error closing ws: %s\n", err.Error())
		}
	}

	tokenExpired, cancel := context.WithDeadline(context.Background(), parsedToken.Expiration())
	defer cancel()

	messagesForUser, err := m.msgListener.MessagesForUser(r.Context(), userId.(string))

	cancelled := false

	for !cancelled {
		select {
		case <-r.Context().Done():
			fmt.Println("connection closed")
			cancelled = true
		case <-tokenExpired.Done():

			writeToWs(conn, "token exp")
			newToken := waitForToken(conn)
			parsedToken, err := jwtauth.VerifyToken(utils.JwtToken, newToken)

			if err != nil {
				fmt.Printf("error parsing token: %s\n %s\n", err.Error(), token)
				cancelled = true
			}

			userId, ok = parsedToken.Get("user_id")

			if !ok {
				cancelled = true
			}

			tokenExpired, cancel = context.WithDeadline(context.Background(), parsedToken.Expiration())
		case message := <-messagesForUser:
			writeToWs(conn, message)
		}
	}

	cancel()
}

func (m msgController) FetchMessages(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract user claims: "+err.Error(), http.StatusUnauthorized)
		return
	}

	userId := claims["user_id"].(string)

	topicTitle := chi.URLParam(r, "topic")

	query := r.URL.Query()

	var after int64
	afterQueryParam, exists := query["after"]

	if !exists || len(afterQueryParam) == 0 {
		after = time.Now().Unix()
	} else {
		parsedAfterDate, err := time.Parse(utils.DateLayout, afterQueryParam[0])

		if err != nil {
			http.Error(w, "wrong date format: "+err.Error(), http.StatusBadRequest)
			return
		}
		after = parsedAfterDate.Unix()

	}

	messages, err := m.msgService.FetchMessages(userId, topicTitle, after)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(messages)

}

func (m msgController) ListenForMessagesSSE(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not retrieve user claims", http.StatusUnauthorized)
		return
	}

	userId := claims["user_id"].(string)

	fmt.Println(claims["exp"].(time.Time))
	fmt.Print(time.Now())
	tokenExpOrReqClosed, cancel := context.WithDeadline(r.Context(), claims["exp"].(time.Time))
	defer cancel()

	userMessages, err := m.msgListener.MessagesForUser(tokenExpOrReqClosed, userId)

	if err != nil {
		fmt.Println("Error when creating message channel")
		utils.RespondWithError(w, err)
		return
	}

	ping := time.After(15 * time.Second)

	flusher := sse.UpgradeToSSEWriter(w)

	cancelled := false

	fmt.Println(">>>>>>>>>>>  Connected")

	for !cancelled {
		select {
		case <-tokenExpOrReqClosed.Done():
			cancelled = true
		case message := <-userMessages:
			sseEvent, err := sse.Event(message, "")
			if err != nil {
				fmt.Println("could not create sse event \n" + err.Error())
			}
			sseEvent.Send(w, flusher)
			fmt.Printf("user: %s - message: %v\n", userId, sseEvent)

		case <-ping:
			sseEvent, err := sse.Event(domain.Message{Content: "ping"}, "")
			if err != nil {
				fmt.Println("could not create sse event \n" + err.Error())
			}
			sseEvent.Send(w, flusher)
			fmt.Printf("user: %s - message: %v\n", userId, sseEvent)

			ping = time.After(15 * time.Second)

		}
	}

	fmt.Printf("user: %s - done\n", userId)
}

func NewMessageController(msgListener service.MessageListener, msgService commonservices.MessageService) MessageController {
	return msgController{
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		msgListener: msgListener,
		msgService:  msgService,
	}
}
