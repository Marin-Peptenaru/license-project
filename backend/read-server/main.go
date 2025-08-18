package main

import (
	"commons/config"
	"commons/repo"
	"commons/utils"
	mongoutils "commons/utils/mongo"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"read-server/controller"
	"read-server/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {

	if len(os.Args) < 2 {
		log.Fatal("missing configuration file path")
		return
	}

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

	msgListener := service.NewMessageListener(appContext, userRepo, topicRepo, cfg)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders: []string{"Link"},
	}))

	var messageNotificationController controller.MessageNotificationsController

	if cfg.Notifications.Protocol == "ws" {
		messageNotificationController = controller.WSMessageNotificationsController(msgListener, cfg)
	} else {
		messageNotificationController = controller.SSEMEssageNotificationController(msgListener, cfg)
	}

	messageNotificationController.InitEndpoints(r)

	utils.Logger.Info(fmt.Sprintf("Starting notifications server using %s as streaming protocol", cfg.Notifications.Protocol))

	utils.Logger.Info(fmt.Sprintf("Starting server at port %s", cfg.Server.Port))

	utils.Logger.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", cfg.Server.Port), r).Error())

}
