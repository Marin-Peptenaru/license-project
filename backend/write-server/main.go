package main

import (
	commonmiddleware "commons/middleware"
	"commons/repo"
	"commons/repo/cache"
	commonservices "commons/service"
	"commons/utils"
	"commons/utils/mongo"
	"net/http"
	"write-server/controller"
	"write-server/service"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth/v5"
)

func main() {
	utils.InitLogger(false)
	log := utils.Logger()
	defer log.Sync()

	mongo.InitDB()
	cache := cache.NewCache()

	userRepo := repo.NewMgmUserRepository()
	userService := commonservices.NewUserService(userRepo)
	userController := controller.NewUserController(userService)

	authService := service.NewAuthService(userRepo, cache)
	authController := controller.NewAuthenticationController(authService)

	topicRepo := repo.NewMgmTopicRepository()
	topicService := commonservices.NewTopicService(topicRepo, userRepo)
	topicController := controller.NewTopicController(topicService, userService)

	messageRepo := repo.NewMgmMessageRepository()
	msgService := commonservices.NewMessageService(userRepo, topicRepo, messageRepo)
	msgNotifier := service.NewMessageNotifier()
	msgController := controller.NewMessageController(msgService, msgNotifier)

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
		msgApi.Post("/", msgController.SendMessage)
	})

	r.Post("/api/register", userController.RegisterUser)

	r.Route("/api/users", func(usersApi chi.Router) {
		usersApi.Use(jwtVerifier)
		usersApi.Use(jwtauth.Authenticator)
		usersApi.Use(commonmiddleware.TokenMustNotBeRefresh)

		usersApi.Get("/", userController.UserDetails)
		usersApi.Get("/search/{username-search-key}", userController.SearchUsers)

	})

	r.Route("/api/auth", func(authApi chi.Router) {

		authApi.Post("/", authController.Login)
	})

	r.Route("/api/auth/logout", func(r chi.Router) {
		r.Use(jwtVerifier)
		r.Use(jwtauth.Authenticator)
		r.Use(commonmiddleware.TokenMustBeRefresh)

		r.Put("/", authController.Logout)
	})

	r.Route("/api/auth/refresh", func(r chi.Router) {
		r.Use(jwtVerifier)
		r.Use(jwtauth.Authenticator)
		r.Use(commonmiddleware.TokenMustBeRefresh)

		r.Post("/", authController.RefreshToken)
	})

	r.Route("/api/topics", func(topicApi chi.Router) {
		topicApi.Use(jwtVerifier)
		topicApi.Use(jwtauth.Authenticator)
		topicApi.Use(commonmiddleware.TokenMustNotBeRefresh)

		topicApi.Post("/", topicController.CreateTopic)
		topicApi.Get("/", topicController.FilterTopics)
		topicApi.Get("/{topic-id}", topicController.TopicDetails)

		topicApi.Put("/subscribe", topicController.SubscribeToTopic)
		topicApi.Put("/unsubscribe", topicController.UnsubscribeToTopic)
		topicApi.Get("/subscribed", topicController.SubscribedTopics)
	})

	log.Error("Some error occurred")
	log.Info("Test Log 2")
	log.Fatal(http.ListenAndServe(":8082", r).Error())

}
