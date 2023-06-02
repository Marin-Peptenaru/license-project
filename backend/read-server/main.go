package main

import (
	commonmiddleware "commons/middleware"
	"commons/repo"
	commonservices "commons/service"
	"commons/utils"
	mongoutils "commons/utils/mongo"
	"context"
	"net/http"
	"read-server/controller"
	"read-server/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth/v5"
)

func main() {

	appContext, cancel := context.WithCancel(context.Background())
	defer cancel()

	mongoutils.InitDB()

	userRepo := repo.NewMgmUserRepository()
	topicRepo := repo.NewMgmTopicRepository()
	messageRepo := repo.NewMgmMessageRepository()

	msgService := commonservices.NewMessageService(userRepo, topicRepo, messageRepo)

	msgListener := service.NewMessageListener(appContext, userRepo, topicRepo)
	msgController := controller.NewMessageController(msgListener, msgService)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders: []string{"Link"},
	}))

	jwtVerifier := jwtauth.Verifier(utils.JwtToken)

	r.Route("/api/messages", func(msgApi chi.Router) {
		msgApi.Use(jwtVerifier)
		msgApi.Use(jwtauth.Authenticator)
		msgApi.Use(commonmiddleware.TokenMustNotBeRefresh)

		msgApi.Get("/stream", msgController.ListenForMessagesSSE)
		msgApi.Get("/", msgController.FilterMessages)

	})

	r.Get("/api/messages/ws", msgController.ListenForMessagesWS)

	utils.Logger().Fatal(http.ListenAndServe(":8081", r).Error())

}
