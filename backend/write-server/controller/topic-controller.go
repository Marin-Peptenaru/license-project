package controller

import (
	"commons/dto"
	commonservices "commons/service"
	"commons/utils"
	httputils "commons/utils/http-utils"
	httpfilter "commons/utils/http-utils/http-filter"
	"encoding/json"
	"log"
	"net/http"
	"write-server/service"

	"github.com/go-chi/chi"
	"github.com/go-chi/jwtauth/v5"
)

type TopicController interface {
	CreateTopic(w http.ResponseWriter, r *http.Request)
	SubscribedTopics(w http.ResponseWriter, r *http.Request)
	// CreatedTopics return the topics created by the user calling this endpoint
	SubscribeToTopic(w http.ResponseWriter, r *http.Request)
	UnsubscribeToTopic(w http.ResponseWriter, r *http.Request)
	TopicDetails(w http.ResponseWriter, r *http.Request)
	FilterTopics(w http.ResponseWriter, r *http.Request)
}

type topicController struct {
	topics               commonservices.TopicService
	users                commonservices.UserService
	subscriptionNotifier service.SubscriptionNotifier
}

func (t topicController) FilterTopics(w http.ResponseWriter, r *http.Request) {
	filter := httpfilter.ExtractTopicFilter(r)

	page := httputils.GetPageInfo(r)

	topics, err := t.topics.FilterTopics(filter, page)

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

	username := claims["user_id"].(string)

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

	userId := claims["user_id"].(string)

	topicData := dto.TopicDTO{}

	err = json.NewDecoder(r.Body).Decode(&topicData)

	if err != nil {
		http.Error(w, "could not decode request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	user, err := t.topics.UnsubscribeToTopic(userId, topicData.Title)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	t.subscriptionNotifier.Notify(*user, topicData.Title)
	w.WriteHeader(http.StatusOK)
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
