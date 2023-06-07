package main

import (
	"commons/config"
	"commons/repo"
	commonservices "commons/service"
	"commons/utils"
	mongoutils "commons/utils/mongo"
	"context"
	"net/http"
	"os"
	"read-server/controller"
	"read-server/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	configFilePath := os.Args[1]
	cfg := config.Load(configFilePath)

	utils.InitLogger(cfg)

	appContext, cancel := context.WithCancel(context.Background())
	defer cancel()

	mongoutils.InitDB(cfg)
	utils.InitJwtToken(cfg)
	utils.InitRedisPool(cfg)

	userRepo := repo.NewMgmUserRepository()
	topicRepo := repo.NewMgmTopicRepository()
	messageRepo := repo.NewMgmMessageRepository()

	msgService := commonservices.NewMessageService(userRepo, topicRepo, messageRepo)

	msgListener := service.NewMessageListener(appContext, userRepo, topicRepo, cfg)
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

	msgController.InitEndpoints(r)

	var messageNotificationController controller.MessageNotificationsController

	if cfg.Notifications.Protocol == "ws" {
		messageNotificationController = controller.WSMessageNotificationsController(msgListener, msgService, cfg)
	} else {
		messageNotificationController = controller.SSEMEssageNotificationController(msgListener, msgService, cfg)
	}

	messageNotificationController.InitEndpoints(r)

	utils.Logger.Fatal(http.ListenAndServe(":8081", r).Error())

}
