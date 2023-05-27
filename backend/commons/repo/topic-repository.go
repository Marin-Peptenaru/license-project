package repo

import (
	"commons/domain"
	"commons/domain/filter"
	"commons/dto"
	"context"
)

type TopicRepository interface {
	Repository
	FilterTopics(ctx context.Context, filter *filter.TopicFilter, topics *[]domain.Topic, page *dto.PageInfo) error
	FindByTitle(ctx context.Context, title string, topic *domain.Topic) error // find by exact title
}
