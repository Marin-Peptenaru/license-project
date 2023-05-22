package repo

import (
	"commons/domain"
	"commons/dto"
	"context"
)

type TopicRepository interface {
	Repository
	FindByAdmin(ctx context.Context, admin string, topics *[]domain.Topic, page *dto.PageInfo) error
	FindByTitleMatch(ctx context.Context, titleMatch string, topics *[]domain.Topic, page *dto.PageInfo) error // find by regex match
	FindByTitle(ctx context.Context, title string, topic *domain.Topic) error                                  // find by exact title
}
