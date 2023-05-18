package controller

import (
	"commons/dto"
	commonservices "commons/service"
	"commons/utils"
	"encoding/json"
	"github.com/go-chi/jwtauth/v5"
	"net/http"
	"write-server/service"
)

type MessageController interface {
	SendMessage(w http.ResponseWriter, r *http.Request)
}

type msgController struct {
	msgService  commonservices.MessageService
	msgNotifier service.MessageNotifier
}

func (m msgController) SendMessage(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract user claims", http.StatusUnauthorized)
		return
	}

	sender := claims["user"].(string)

	msg := dto.MessageDTO{}
	err = json.NewDecoder(r.Body).Decode(&msg)

	if err != nil {
		utils.RespondWithError(w, err)
	} else {

		message, err := m.msgService.SaveMessage(sender, msg.Topic, msg.Content)

		if err != nil {
			utils.RespondWithError(w, err)
		} else {
			json.NewEncoder(w).Encode(message)
			m.msgNotifier.Notify(*message)

		}
	}
}

func NewMessageController(msgService commonservices.MessageService, notifier service.MessageNotifier) MessageController {
	return msgController{msgService, notifier}
}