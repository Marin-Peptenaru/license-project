package controller

import (
	c "commons/controller"
	"commons/dto"
	"commons/middleware"
	commonservices "commons/service"
	httputils "commons/utils/http-utils"
	httpfilter "commons/utils/http-utils/http-filter"
	"encoding/json"
	"net/http"
	"write-server/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
)

type MessageController interface {
	c.Controller
	SendMessage(w http.ResponseWriter, r *http.Request)
	FilterMessages(w http.ResponseWriter, r *http.Request)
}

type msgController struct {
	msgService  commonservices.MessageService
	msgNotifier service.MessageNotifier
}

func (m *msgController) SendMessage(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract user claims", http.StatusUnauthorized)
		return
	}

	senderId := claims["user_id"].(string)

	msg := dto.MessageDTO{}
	err = json.NewDecoder(r.Body).Decode(&msg)

	if err != nil {
		httputils.RespondWithError(w, err)
	} else {

		message, err := m.msgService.SaveMessage(senderId, msg.Topic, msg.Content)

		if err != nil {
			httputils.RespondWithError(w, err)
		} else {
			json.NewEncoder(w).Encode(message)
			m.msgNotifier.Notify(*message)

		}
	}
}

func (m *msgController) FilterMessages(w http.ResponseWriter, r *http.Request) {
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

func (m *msgController) InitEndpoints(r chi.Router) {
	r.Route("/api/messages", func(msgApi chi.Router) {
		msgApi.Use(middleware.JwtVerifier)
		msgApi.Use(jwtauth.Authenticator)
		msgApi.Use(middleware.TokenMustNotBeRefresh)

		msgApi.Post("/", m.SendMessage)
		msgApi.Get("/", m.FilterMessages)
	})
}

func NewMessageController(msgService commonservices.MessageService, notifier service.MessageNotifier) MessageController {
	return &msgController{msgService, notifier}
}
