package service

import (
	"commons/apperrors"
	"commons/config"
	"commons/domain"
	"commons/dto"
	"commons/repo"
	"commons/utils"
	"context"
	"read-server/streaming"
	"read-server/subscription"

	"go.uber.org/zap"
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

		defer close(messagesForUser)

		for !cancelled {
			select {
			case <-ctx.Done():
				cancel()
				cancelled = true
			case message := <-messages:
				utils.Logger.Info("Is message subscribed", zap.Any("message", message), zap.Any("user", user), zap.Any("subscribed", userSubsStatus.IsSubscribed(message.To)))
				if userSubsStatus.IsSubscribed(message.To) {
					messagesForUser <- message
				}
			}
		}
	}()

	return messagesForUser, nil
}

func NewMessageListener(ctx context.Context, users repo.UserRepository, topics repo.TopicRepository, cfg *config.Config) MessageListener {
	messageObserver := streaming.NewStreamObserver[domain.Message]("msg-stream", ctx, cfg)
	messageObserver.StartObserving()

	subscriptionObserver := streaming.NewStreamObserver[dto.SubscriptionDTO]("subs-stream", ctx, cfg)
	subscriptionObserver.StartObserving()

	return msgListener{
		ctx:                   ctx,
		users:                 users,
		messageObserver:       messageObserver,
		subscriptionsObserver: subscriptionObserver,
		topics:                topics,
	}
}
