package subscription

import (
	"commons/domain"
	"commons/dto"
	"context"
	"fmt"
	"read-server/streaming"
	"sync"
)

type UserSubscriptionsObserver interface {
	IsSubscribed(topicTitle string) bool
}

type syncUserSubsObs struct {
	topics map[string]bool
	lock   sync.RWMutex
}

func (s *syncUserSubsObs) IsSubscribed(topicTitle string) bool {

	var subscribed bool

	s.lock.RLock()

	subscribed, ok := s.topics[topicTitle]

	if !ok {
		subscribed = false
	}

	s.lock.RUnlock()

	return subscribed
}

func (s *syncUserSubsObs) handleSubscription(subscription dto.SubscriptionDTO) {
	if subscription.Status == dto.Subscribed {
		fmt.Printf("User %s subscribed to %s", subscription.Username, subscription.TopicTitle)
	} else {
		fmt.Printf("User %s unsubscribed to %s", subscription.Username, subscription.TopicTitle)

	}

	s.lock.Lock()

	if subscription.Status == dto.Subscribed {
		s.topics[subscription.TopicTitle] = true
	} else {
		delete(s.topics, subscription.TopicTitle)
	}

	s.lock.Unlock()
}

func ObserveUserSubscriptions(user domain.User, subs streaming.StreamObserver[dto.SubscriptionDTO], ctx context.Context) UserSubscriptionsObserver {
	topicsObserver := syncUserSubsObs{topics: make(map[string]bool), lock: sync.RWMutex{}}

	for topic := range user.Topics {
		topicsObserver.topics[topic] = true
	}

	for topic := range user.CreatedTopics {
		topicsObserver.topics[topic] = true
	}

	fmt.Println(topicsObserver.topics)

	subscriptions, cancel := subs.Subscribe()

	go func() {
		cancelled := false

		for !cancelled {
			select {
			case <-ctx.Done():
				cancel()
				cancelled = true
			case subscription := <-subscriptions:
				if subscription.ConcernsUser(user) {
					topicsObserver.handleSubscription(subscription)
				}
			}
		}
	}()

	return &topicsObserver
}
