package controller

import (
	c "commons/controller"
	"commons/middleware"
	commonservices "commons/service"
	httputils "commons/utils/http-utils"
	httpfilter "commons/utils/http-utils/http-filter"
	"encoding/json"
	"net/http"
	"read-server/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
)

type MessageController interface {
	c.Controller
	FilterMessages(w http.ResponseWriter, r *http.Request)
}

type msgController struct {
	msgListener service.MessageListener
	msgService  commonservices.MessageService
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

func (msg *msgController) InitEndpoints(r chi.Router) {
	r.Route("/api/messages", func(msgApi chi.Router) {
		msgApi.Use(middleware.JwtVerifier)
		msgApi.Use(jwtauth.Authenticator)
		msgApi.Use(middleware.TokenMustNotBeRefresh)

		msgApi.Get("/", msg.FilterMessages)

	})
}
func NewMessageController(msgListener service.MessageListener, msgService commonservices.MessageService) MessageController {
	return &msgController{
		msgListener: msgListener,
		msgService:  msgService,
	}
}
