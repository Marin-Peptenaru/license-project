package repo

import (
	"commons/domain"
	"context"
)

type MessageRepository interface {
	Repository
	FindByTopicAndAfterTimestamp(ctx context.Context, topic string, after int64, messages *[]domain.Message) error
}
