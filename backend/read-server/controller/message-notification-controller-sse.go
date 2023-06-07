package controller

import (
	"commons/config"
	"commons/domain"
	"commons/middleware"
	commonservices "commons/service"
	"commons/utils"
	httputils "commons/utils/http-utils"
	"context"
	"net/http"
	"read-server/controller/sse"
	"read-server/service"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"go.uber.org/zap"
)

type messageNotificationControllerSSE struct {
	flush        bool
	ping         bool
	pingInterval time.Duration
	listener     service.MessageListener
	msgService   commonservices.MessageService
}

func (m *messageNotificationControllerSSE) listenWithPing(w http.ResponseWriter, messages <-chan domain.Message, userId string, ctx context.Context) {
	ping := time.After(m.pingInterval)

	cancelled := false

	for !cancelled {
		select {
		case <-ctx.Done():
			cancelled = true
		case message := <-messages:
			sseEvent, err := sse.Event(message, "")

			if err != nil {
				utils.Logger.Error("could not create sse event", zap.Error(err))
			}

			sseEvent.Send(w, m.flush)
			utils.Logger.Info("message sse sent to user",
				zap.String("userId", userId),
				zap.Any("event", sseEvent),
			)

		case <-ping:
			pingEvent, err := sse.Event(domain.Message{Content: "ping"}, "")
			if err != nil {
				utils.Logger.Error("could not create ping event", zap.Error(err))
			}
			pingEvent.Send(w, m.flush)
			utils.Logger.Info("ping sent to user",
				zap.String("userId", userId),
			)

			ping = time.After(m.pingInterval)
		}
	}

}

func (m *messageNotificationControllerSSE) listenWithoutPing(w http.ResponseWriter, messages <-chan domain.Message, userId string, ctx context.Context) {

	cancelled := false

	for !cancelled {
		select {
		case <-ctx.Done():
			cancelled = true
		case message := <-messages:
			sseEvent, err := sse.Event(message, "")

			if err != nil {
				utils.Logger.Error("could not create sse event", zap.Error(err))
			}

			sseEvent.Send(w, m.flush)
			utils.Logger.Info("message sse sent to user",
				zap.String("userId", userId),
				zap.Any("event", sseEvent),
			)
		}
	}

}

func (m *messageNotificationControllerSSE) ListenForMessages(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not retrieve user claims", http.StatusUnauthorized)
		return
	}

	userId := claims["user_id"].(string)

	tokenExpOrReqClosed, cancel := context.WithDeadline(r.Context(), claims["exp"].(time.Time))
	defer cancel()

	userMessages, err := m.listener.MessagesForUser(tokenExpOrReqClosed, userId)

	if err != nil {
		httputils.RespondWithError(w, err)
		return
	}

	sse.UpgradeToSSEWriter(w)

	if m.ping {
		m.listenWithPing(w, userMessages, userId, tokenExpOrReqClosed)
	} else {
		m.listenWithoutPing(w, userMessages, userId, tokenExpOrReqClosed)
	}

	utils.Logger.Info("closing connection for user", zap.String("userId", userId))
}

func (m *messageNotificationControllerSSE) InitEndpoints(r chi.Router) {
	r.Route("/api/messages", func(msgApi chi.Router) {
		msgApi.Use(middleware.JwtVerifier)
		msgApi.Use(jwtauth.Authenticator)
		msgApi.Use(middleware.TokenMustNotBeRefresh)

		msgApi.Get("/stream", m.ListenForMessages)
	})

}

func SSEMEssageNotificationController(listener service.MessageListener, msgService commonservices.MessageService, cfg *config.Config) MessageNotificationsController {
	return &messageNotificationControllerSSE{
		flush:        cfg.Notifications.SSE.Flush,
		ping:         cfg.Notifications.SSE.Ping.Enabled,
		pingInterval: time.Duration(cfg.Notifications.SSE.Ping.Interval) * time.Second,
		listener:     listener,
		msgService:   msgService,
	}
}
