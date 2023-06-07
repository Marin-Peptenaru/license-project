package controller

import (
	c "commons/controller"
	"net/http"
)

type MessageNotificationsController interface {
	c.Controller
	ListenForMessages(w http.ResponseWriter, r *http.Request)
}
