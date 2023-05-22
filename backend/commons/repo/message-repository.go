package repo

import (
	"commons/domain"
	"commons/dto"
	"context"
)

type MessageRepository interface {
	Repository
	FindByTopicAndAfterTimestamp(ctx context.Context, topic string, after int64, messages *[]domain.Message, page *dto.PageInfo) error
}
