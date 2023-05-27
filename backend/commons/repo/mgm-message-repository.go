package repo

import (
	"commons/domain"
	"commons/domain/filter"
	"commons/dto"
	"context"

	"github.com/kamva/mgm/v3"
	"github.com/kamva/mgm/v3/operator"
	"go.mongodb.org/mongo-driver/bson"
)

type mgmMessageRepository struct {
	mgmRepository
}

func (m *mgmMessageRepository) FindByTopicAndAfterTimestamp(ctx context.Context, filter *filter.MessageFilter, messages *[]domain.Message, page *dto.PageInfo) error {

	opts := pageInfoToFindOptions(page)

	err := mgm.Coll(&domain.Message{}).SimpleFindWithCtx(ctx, messages, bson.M{
		"to":        filter.To,
		"timestamp": bson.M{operator.Gte: filter.After},
	}, opts)

	return err
}

func NewMgmMessageRepository() MessageRepository {
	return &mgmMessageRepository{
		mgmRepository{
			func() mgm.Model {
				return &domain.Message{}
			},
		},
	}
}
