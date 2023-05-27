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

type mgmUserRepo struct {
	mgmRepository
}

func (m *mgmUserRepo) FindByUsername(ctx context.Context, username string, user *domain.User) error {

	err := mgm.Coll(user).FirstWithCtx(ctx, bson.M{"username": username}, user)

	if err == mongo.ErrNoDocuments {
		return ErrNoMatchingEntity
	}

	return err
}

func (m *mgmUserRepo) FindByEmail(ctx context.Context, email string, user *domain.User) error {

	err := mgm.Coll(user).FirstWithCtx(ctx, bson.M{"email": email}, user)

	if err == mongo.ErrNoDocuments {
		return ErrNoMatchingEntity
	}

	return err
}

func (m *mgmUserRepo) FindByUsernameOrEmail(ctx context.Context, username string, email string, user *domain.User) error {

	err := mgm.Coll(user).FirstWithCtx(ctx, bson.M{
		operator.Or: bson.A{
			bson.M{"username": username},
			bson.M{"email": email},
		},
	}, user)

	if err == mongo.ErrNoDocuments {
		return ErrNoMatchingEntity
	}

	return err
}

func (m *mgmUserRepo) FilterUsers(ctx context.Context, filter *filter.UserFilter, users *[]domain.User, page *dto.PageInfo) error {

	opts := pageInfoToFindOptions(page)

	err := mgm.Coll(&domain.User{}).SimpleFindWithCtx(ctx, users, bson.M{
		"username": bson.M{
			operator.Regex: primitive.Regex{
				Pattern: filter.Username, Options: "i",
			},
		},
	}, opts)

	return err
}

func NewMgmUserRepository() UserRepository {
	return &mgmUserRepo{
		mgmRepository: mgmRepository{
			nullEntityGenerator: func() mgm.Model {
				return &domain.User{}
			},
		},
	}

}
