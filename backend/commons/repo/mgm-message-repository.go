package repo

import (
	"commons/domain"
	"commons/dto"
	"context"

	"github.com/kamva/mgm/v3"
	"github.com/kamva/mgm/v3/operator"
	"go.mongodb.org/mongo-driver/bson"
)

type mgmMessageRepository struct {
	mgmRepository
}

func (m *mgmMessageRepository) FindByTopicAndAfterTimestamp(ctx context.Context, topic string, after int64, messages *[]domain.Message, page *dto.PageInfo) error {

	opts := pageInfoToFindOptions(page)

	err := mgm.Coll(&domain.Message{}).SimpleFindWithCtx(ctx, messages, bson.M{
		"to":        topic,
		"timestamp": bson.M{operator.Gte: after},
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
