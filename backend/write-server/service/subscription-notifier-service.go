package service

import (
	"commons/domain"
	"commons/dto"
	"fmt"
	"write-server/streaming"
)

type SubscriptionNotifier interface {
	Notify(user domain.User, topicTitle string)
}

type subscriptionNotifier struct {
	writer streaming.StreamWriter[dto.SubscriptionDTO]
}

func (s subscriptionNotifier) Notify(user domain.User, topicTitle string) {
	notification := dto.SubscriptionDTO{
		Username:   user.Username,
		TopicTitle: topicTitle,
	}

	if user.Topics[topicTitle] {
		notification.Status = dto.Subscribed
	} else {
		notification.Status = dto.Unsubscirbed
	}

	err := s.writer.Write("sub", notification)
	if err != nil {
		fmt.Println(err)
	}
}

func NewSubscriptionNotifier() SubscriptionNotifier {
	return subscriptionNotifier{
		writer: streaming.NewStreamWriter[dto.SubscriptionDTO]("subs-stream"),
	}
}
