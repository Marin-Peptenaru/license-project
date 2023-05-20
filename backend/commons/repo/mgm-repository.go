package repo

import (
	"context"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type mgmRepository struct {
	nullEntityGenerator func() mgm.Model
}

func (m *mgmRepository) Add(ctx context.Context, entity mgm.Model) error {
	return mgm.Coll(entity).CreateWithCtx(ctx, entity)
}

func (m *mgmRepository) Remove(ctx context.Context, entity mgm.Model) error {
	return mgm.Coll(entity).DeleteWithCtx(ctx, entity)
}

func (m *mgmRepository) Update(ctx context.Context, entity mgm.Model) error {
	return mgm.Coll(entity).UpdateWithCtx(ctx, entity)
}

func (m *mgmRepository) FindById(ctx context.Context, id string, result mgm.Model) error {

	err := mgm.Coll(result).FindByIDWithCtx(ctx, id, result)

	if err == mongo.ErrNoDocuments {
		return ErrNoMatchingEntity
	}

	return err
}

func (m *mgmRepository) FindAll(ctx context.Context, result *[]mgm.Model) error {

	err := mgm.Coll(m.NullEntity()).SimpleFindWithCtx(ctx, result, bson.M{})

	return err
}

func (m *mgmRepository) NullEntity() mgm.Model {
	return m.nullEntityGenerator()
}

func (m *mgmRepository) Ctx() context.Context {
	return mgm.Ctx()
}

func NewMgmRepository(nullEntityGenerator func() mgm.Model) Repository {
	return &mgmRepository{
		nullEntityGenerator: nullEntityGenerator,
	}
}
