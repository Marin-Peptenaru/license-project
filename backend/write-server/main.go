package main

import (
	"commons/config"
	"commons/repo"
	"commons/repo/cache"
	commonservices "commons/service"
	"commons/utils"
	"commons/utils/mongo"
	"fmt"
	"net/http"
	"os"
	"write-server/controller"
	"write-server/service"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {

	configFilePath := os.Args[1]
	fmt.Println(configFilePath)

	cfg := config.Load(configFilePath)

	utils.InitLogger(cfg)
	defer utils.Logger.Sync()

	utils.InitRedisPool(cfg)
	utils.InitJwtToken(cfg)

	mongo.InitDB(cfg)
	cache := cache.NewCache(cfg)

	userRepo := repo.NewMgmUserRepository()
	userService := commonservices.NewUserService(userRepo)
	userController := controller.NewUserController(userService)

	authService := service.NewAuthService(userRepo, cache, cfg)
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

	authController.InitEndpoints(r)
	userController.InitEndpoints(r)
	topicController.InitEndpoints(r)
	msgController.InitEndpoints(r)

	utils.Logger.Fatal(http.ListenAndServe(":8082", r).Error())

}
