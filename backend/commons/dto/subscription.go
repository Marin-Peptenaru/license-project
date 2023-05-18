package dto

import "commons/domain"

type SubscriptionStatus int8

const (
	Subscribed SubscriptionStatus = iota
	Unsubscirbed
)

type SubscriptionDTO struct {
	Username   string
	TopicTitle string
	Status     SubscriptionStatus
}

func (s SubscriptionDTO) ConcernsUser(user domain.User) bool {
	return s.Username == user.Username
}
