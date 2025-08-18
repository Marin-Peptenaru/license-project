package controller

import (
	"commons/config"
	"commons/utils"
	"context"
	"encoding/json"
	"net/http"
	"read-server/service"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

type messageNotificationControllerWS struct {
	writeTimeout time.Duration
	tokenTimeout time.Duration
	upgrader     websocket.Upgrader
	msgListener  service.MessageListener
}

func (m *messageNotificationControllerWS) waitForToken(conn *websocket.Conn) string {

	var token string
	err := conn.SetReadDeadline(time.Now().Add(m.tokenTimeout))

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

func (m *messageNotificationControllerWS) writeToWs(conn *websocket.Conn, msg any) {

	err := conn.SetWriteDeadline(time.Now().Add(m.writeTimeout))

	if err != nil {
		utils.Logger.Error("error setting ws write timeout %s\n", zap.Error(err))
	}

	jsonMsg, _ := json.Marshal(msg)

	err = conn.WriteMessage(websocket.TextMessage, jsonMsg)

	if err != nil {
		utils.Logger.Error("error writing to ws: %s\n", zap.Error(err))
	}

}

func (m *messageNotificationControllerWS) ListenForMessages(w http.ResponseWriter, r *http.Request) {

	utils.Logger.Debug("Before ws upgrade")
	conn, err := m.upgrader.Upgrade(w, r, nil)
	utils.Logger.Debug("After ws upgrade")
	if err != nil {
		utils.Logger.Error("error doing ws upgrade", zap.Error(err))
	}

	defer func(conn *websocket.Conn) {
		err := conn.Close()
		if err != nil {
			utils.Logger.Error("error closing ws connection: ", zap.Error(err))
		}
	}(conn)

	m.writeToWs(conn, "authenticate")
	tokenString := m.waitForToken(conn)
	parsedToken, err := jwtauth.VerifyToken(utils.JwtToken, tokenString)

	if err != nil {
		utils.Logger.Error("error parsing token", zap.String("token", tokenString))
		return
	}

	userId, ok := parsedToken.Get("user_id")

	if !ok {
		m.writeToWs(conn, "missing user_id claim")
		err := conn.Close()
		if err != nil {
			utils.Logger.Error("error closing ws connection: ", zap.Error(err))
		}
	}

	tokenExpired, cancel := context.WithDeadline(context.Background(), parsedToken.Expiration())
	defer cancel()

	messagesForUser, _ := m.msgListener.MessagesForUser(context.Background(), userId.(string))

	cancelled := false

	for !cancelled {
		select {
		case <-r.Context().Done():
			cancelled = true
		case <-tokenExpired.Done():
			m.writeToWs(conn, "authenticate")
			newToken := m.waitForToken(conn)
			parsedToken, err := jwtauth.VerifyToken(utils.JwtToken, newToken)

			if err != nil {
				utils.Logger.Error("error parsing token", zap.String("token", newToken), zap.Any("user id", userId))
				cancelled = true
			}

			userId, ok = parsedToken.Get("user_id")

			if !ok {
				cancelled = true
			}

			tokenExpired, cancel = context.WithDeadline(context.Background(), parsedToken.Expiration())
		case message := <-messagesForUser:
			utils.Logger.Info("Received message", zap.Any("message", message))
			m.writeToWs(conn, message)
		}
	}

	utils.Logger.Info("closing ws connection for user", zap.Any("user id", userId))
	cancel()
}

func (m *messageNotificationControllerWS) InitEndpoints(r chi.Router) {
	r.Get("/api/messages/stream/", m.ListenForMessages)
}

func WSMessageNotificationsController(listener service.MessageListener, cfg *config.Config) MessageNotificationsController {
	utils.Logger.Debug("WS constructor run")
	return &messageNotificationControllerWS{
		writeTimeout: time.Duration(cfg.Notifications.WS.Timeout.Write) * time.Millisecond,
		tokenTimeout: time.Duration(cfg.Notifications.WS.Timeout.Token) * time.Millisecond,
		msgListener:  listener,
		upgrader: websocket.Upgrader{
			HandshakeTimeout: time.Duration(cfg.Notifications.WS.Timeout.Handshake) * time.Millisecond,
			ReadBufferSize:   0, // setting buffer sizes to 0 will just use the default http.ResponseWriter buffer size instead
			WriteBufferSize:  0,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}

}
