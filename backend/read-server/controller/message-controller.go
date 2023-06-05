package controller

import (
	"commons/domain"
	commonservices "commons/service"
	"commons/utils"
	httputils "commons/utils/http-utils"
	httpfilter "commons/utils/http-utils/http-filter"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"read-server/controller/sse"
	"read-server/service"
	"time"

	"github.com/go-chi/jwtauth/v5"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

const (
	wsWriteTimeout    = 200 * time.Millisecond
	wsTokenWaitTimout = 1 * time.Second
)

type MessageController interface {
	ListenForMessagesSSE(w http.ResponseWriter, r *http.Request)
	ListenForMessagesWS(w http.ResponseWriter, r *http.Request)
	FilterMessages(w http.ResponseWriter, r *http.Request)
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
		utils.Logger.Error(err.Error())
		return ""
	}

	_, msg, err := conn.ReadMessage()

	if err != nil {
		utils.Logger.Error("error while wainting for token: %s \n", zap.Error(err))
		return ""
	}

	token = string(msg)

	return token

}

func writeToWs(conn *websocket.Conn, msg any) {

	err := conn.SetWriteDeadline(time.Now().Add(wsWriteTimeout))

	if err != nil {
		utils.Logger.Error("error setting ws write timeout %s\n", zap.Error(err))
	}

	jsonMsg, _ := json.Marshal(msg)

	err = conn.WriteMessage(websocket.TextMessage, jsonMsg)

	if err != nil {
		utils.Logger.Error("error writing to ws: %s\n", zap.Error(err))
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
		utils.Logger.Error("error doing ws upgrade", zap.Error(err))
	}

	defer func(conn *websocket.Conn) {
		err := conn.Close()
		if err != nil {
			utils.Logger.Error("error closing ws connection: ", zap.Error(err))
		}
	}(conn)

	userId, ok := parsedToken.Get("user_id")

	if !ok {
		writeToWs(conn, "missing user_id claim")
		err := conn.Close()
		if err != nil {
			utils.Logger.Error("error closing ws connection: ", zap.Error(err))
		}
	}

	tokenExpired, cancel := context.WithDeadline(context.Background(), parsedToken.Expiration())
	defer cancel()

	messagesForUser, _ := m.msgListener.MessagesForUser(r.Context(), userId.(string))

	cancelled := false

	for !cancelled {
		select {
		case <-r.Context().Done():
			cancelled = true
		case <-tokenExpired.Done():
			writeToWs(conn, "token exp")
			newToken := waitForToken(conn)
			parsedToken, err := jwtauth.VerifyToken(utils.JwtToken, newToken)

			if err != nil {
				utils.Logger.Error("error parsing token", zap.String("token", token), zap.Any("user id", userId))
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

	utils.Logger.Info("closing ws connection for user", zap.Any("user id", userId))
	cancel()
}

func (m msgController) FilterMessages(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract user claims: "+err.Error(), http.StatusUnauthorized)
		return
	}

	userId := claims["user_id"].(string)

	page := httputils.GetPageInfo(r)
	filter := httpfilter.ExtractMessageFilter(r)

	messages, err := m.msgService.FetchMessages(userId, filter, page)

	if err != nil {
		httputils.RespondWithError(w, err)
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

	tokenExpOrReqClosed, cancel := context.WithDeadline(r.Context(), claims["exp"].(time.Time))
	defer cancel()

	userMessages, err := m.msgListener.MessagesForUser(tokenExpOrReqClosed, userId)

	if err != nil {
		httputils.RespondWithError(w, err)
		return
	}

	ping := time.After(15 * time.Second)

	flusher := sse.UpgradeToSSEWriter(w)

	cancelled := false

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
