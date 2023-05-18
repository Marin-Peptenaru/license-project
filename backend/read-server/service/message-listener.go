package service

import (
	"commons/apperrors"
	"commons/domain"
	"commons/dto"
	"commons/repo"
	"context"
	"read-server/streaming"
	"read-server/subscription"
)

type MessageListener interface {
	MessagesForUser(ctx context.Context, userId string) (<-chan domain.Message, error)
}

type msgListener struct {
	ctx                   context.Context
	users                 repo.UserRepository
	topics                repo.TopicRepository
	messageObserver       streaming.StreamObserver[domain.Message]
	subscriptionsObserver streaming.StreamObserver[dto.SubscriptionDTO]
}

func (m msgListener) MessagesForUser(ctx context.Context, userId string) (<-chan domain.Message, error) {
	user := &domain.User{}
	err := m.users.FindById(m.users.Ctx(), userId, user)

	if err != nil {
		return nil, apperrors.InvalidEntity("could not fetch user data: " + err.Error())
	}

	userSubsStatus := subscription.ObserveUserSubscriptions(*user, m.subscriptionsObserver, ctx)

	messagesForUser := make(chan domain.Message)

	messages, cancel := m.messageObserver.Subscribe()

	go func() {
		cancelled := false

		for !cancelled {
			select {
			case <-ctx.Done():
				cancel()
				cancelled = true
			case message := <-messages:
				if userSubsStatus.IsSubscribed(message.To) {
					messagesForUser <- message
				}
			}
		}
	}()

	return messagesForUser, nil
}

func NewMessageListener(ctx context.Context, users repo.UserRepository, topics repo.TopicRepository) MessageListener {
	messageObserver := streaming.NewStreamObserver[domain.Message]("msg-stream", ctx)
	messageObserver.StartObserving()

	subscriptionObserver := streaming.NewStreamObserver[dto.SubscriptionDTO]("subs-stream", ctx)
	subscriptionObserver.StartObserving()

	return msgListener{
		ctx:                   ctx,
		users:                 users,
		messageObserver:       messageObserver,
		subscriptionsObserver: subscriptionObserver,
		topics:                topics,
	}
}
