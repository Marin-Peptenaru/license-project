package repo

import (
	"commons/domain"
	"context"
)

type TopicRepository interface {
	Repository
	FindByAdmin(ctx context.Context, admin string, topics *[]domain.Topic) error
	FindByTitleMatch(ctx context.Context, titleMatch string, topics *[]domain.Topic) error // find by regex match
	FindByTitle(ctx context.Context, title string, topic *domain.Topic) error              // find by exact title
}
