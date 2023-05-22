package repo

import (
	"commons/dto"
	"context"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func pageInfoToFindOptions(page *dto.PageInfo) *options.FindOptions {
	opts := options.Find()

	if page != nil {
		opts.SetSkip(int64(page.PageSize * page.PageNumber))
		opts.SetLimit(int64(page.PageSize))
	}

	return opts
}

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

func (m *mgmRepository) Find(ctx context.Context, result *[]mgm.Model, page *dto.PageInfo) error {

	opts := pageInfoToFindOptions(page)

	err := mgm.Coll(m.NullEntity()).SimpleFindWithCtx(
		ctx,
		result,
		bson.M{},
		opts,
	)

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
