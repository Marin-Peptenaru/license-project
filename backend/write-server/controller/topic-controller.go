package controller

import (
	"commons/domain"
	"commons/dto"
	commonservices "commons/service"
	"commons/utils"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/jwtauth/v5"
	"log"
	"net/http"
	"strings"
	"write-server/service"
)

type TopicController interface {
	CreateTopic(w http.ResponseWriter, r *http.Request)
	SubscribedTopics(w http.ResponseWriter, r *http.Request)
	TopicsOfUser(w http.ResponseWriter, r *http.Request)
	// CreatedTopics return the topics created by the user calling this endpoint
	CreatedTopics(w http.ResponseWriter, r *http.Request)
	SubscribeToTopic(w http.ResponseWriter, r *http.Request)
	UnsubscribeToTopic(w http.ResponseWriter, r *http.Request)
	TopicDetails(w http.ResponseWriter, r *http.Request)
	SearchTopic(w http.ResponseWriter, r *http.Request)
}

type topicController struct {
	topics               commonservices.TopicService
	users                commonservices.UserService
	subscriptionNotifier service.SubscriptionNotifier
}

func (t topicController) SearchTopic(w http.ResponseWriter, r *http.Request) {
	searchKey := strings.TrimSpace(chi.URLParam(r, "search-key"))

	if len(searchKey) == 0 {
		json.NewEncoder(w).Encode([]domain.Topic{})
		return
	}

	topics, err := t.topics.SearchTopicByTitle(searchKey)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(topics)

}

func (t topicController) TopicDetails(w http.ResponseWriter, r *http.Request) {
	topicId := chi.URLParam(r, "topic-id")
	topic, err := t.topics.TopicDetails(topicId)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	err = json.NewEncoder(w).Encode(topic)
	if err != nil {
		log.Println("could not encode response")
	}
}

func (t topicController) SubscribeToTopic(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract token", http.StatusInternalServerError)
		return
	}

	username := claims["user"].(string)

	topicData := dto.TopicDTO{}

	err = json.NewDecoder(r.Body).Decode(&topicData)

	if err != nil {
		http.Error(w, "could not decode request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	user, topic, err := t.topics.SubscribeToTopic(username, topicData.Id, topicData.Password)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	t.subscriptionNotifier.Notify(*user, topic.Title)
	w.WriteHeader(http.StatusOK)
}

func (t topicController) UnsubscribeToTopic(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not identify calling user", http.StatusInternalServerError)
		return
	}

	username := claims["user"].(string)

	topicData := dto.TopicDTO{}

	err = json.NewDecoder(r.Body).Decode(&topicData)

	if err != nil {
		http.Error(w, "could not decode request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	user, err := t.topics.UnsubscribeToTopic(username, topicData.Title)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	t.subscriptionNotifier.Notify(*user, topicData.Title)
	w.WriteHeader(http.StatusOK)
}

func (t topicController) getTopicsOf(w http.ResponseWriter, username string) {
	topics, err := t.topics.TopicsCreatedBy(username)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	if json.NewEncoder(w).Encode(topics) != nil {
		log.Print("could not encode topics to response")
	}
}

func (t topicController) TopicsOfUser(w http.ResponseWriter, r *http.Request) {
	user := chi.URLParam(r, "user")

	t.getTopicsOf(w, user)
}

func (t topicController) CreatedTopics(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, fmt.Sprintf("could not extract token: %s", err.Error()), http.StatusUnauthorized)
		return
	}

	t.getTopicsOf(w, claims["user"].(string))

}

func (t topicController) CreateTopic(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "unauthorized: could not extract claims", http.StatusUnauthorized)
		return
	}

	topicData := dto.TopicDTO{}

	if json.NewDecoder(r.Body).Decode(&topicData) != nil {
		http.Error(w, "could not decode request body", http.StatusBadRequest)
		return
	}

	newTopic, err := t.topics.CreateTopic(claims["user"].(string), topicData.Title, topicData.Public, topicData.Password)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newTopic)
}

func (t topicController) SubscribedTopics(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not identify user", http.StatusInternalServerError)
		return
	}

	userId := claims["user_id"].(string)

	topics, err := t.topics.SubscribedTopics(userId)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	err = json.NewEncoder(w).Encode(topics)
	if err != nil {
		log.Println("could not encode json response")
		return
	}

}

func NewTopicController(topics commonservices.TopicService, users commonservices.UserService) TopicController {
	return topicController{topics: topics, users: users, subscriptionNotifier: service.NewSubscriptionNotifier()}
}