package repo

import (
	"commons/domain"
	"commons/domain/filter"
	"commons/dto"
	"context"

	"github.com/kamva/mgm/v3"
	"github.com/kamva/mgm/v3/operator"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type mgmTopicRepository struct {
	mgmRepository
}

func (m *mgmTopicRepository) FilterTopics(ctx context.Context, filter *filter.TopicFilter, topics *[]domain.Topic, page *dto.PageInfo) error {
	opts := pageInfoToFindOptions(page)

	err := mgm.Coll(&domain.Topic{}).SimpleFindWithCtx(ctx, topics, bson.M{
		"admin": filter.Admin,
		"title": bson.M{
			operator.Regex: primitive.Regex{
				Pattern: filter.Title, Options: "i",
			},
		},
	}, opts)

	if err == mongo.ErrNoDocuments {
		return ErrNoMatchingEntity
	}
	return err
}

func (m *mgmTopicRepository) FindByTitle(ctx context.Context, title string, topic *domain.Topic) error {

	err := mgm.Coll(topic).FirstWithCtx(ctx, bson.M{"title": title}, topic)

	if err == mongo.ErrNoDocuments {
		return ErrNoMatchingEntity
	}

	return err
}

func NewMgmTopicRepository() TopicRepository {
	return &mgmTopicRepository{
		mgmRepository{
			nullEntityGenerator: func() mgm.Model {
				return &domain.Topic{}
			},
		},
	}
}
