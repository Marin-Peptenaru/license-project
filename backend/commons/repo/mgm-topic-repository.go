package repo

import (
	"commons/domain"
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

func (m *mgmTopicRepository) FindByAdmin(ctx context.Context, admin string, topics *[]domain.Topic, page *dto.PageInfo) error {
	opts := pageInfoToFindOptions(page)

	err := mgm.Coll(&domain.Topic{}).SimpleFindWithCtx(ctx, topics, bson.M{"admin": admin}, opts)

	if err == mongo.ErrNoDocuments {
		return ErrNoMatchingEntity
	}
	return err
}

func (m *mgmTopicRepository) FindByTitleMatch(ctx context.Context, titleMatch string, topics *[]domain.Topic, page *dto.PageInfo) error {

	opts := pageInfoToFindOptions(page)

	err := mgm.Coll(&domain.Topic{}).SimpleFindWithCtx(ctx, topics, bson.M{
		"title": bson.M{
			operator.Regex: primitive.Regex{
				Pattern: titleMatch, Options: "i",
			},
		},
	}, opts)

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
