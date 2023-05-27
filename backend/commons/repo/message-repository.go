package repo

import (
	"commons/domain"
	"commons/domain/filter"
	"commons/dto"
	"context"
)

type MessageRepository interface {
	Repository
	FindByTopicAndAfterTimestamp(ctx context.Context, filter *filter.MessageFilter, messages *[]domain.Message, page *dto.PageInfo) error
}
