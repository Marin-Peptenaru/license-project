package repo

import (
	"commons/domain"
	"commons/domain/filter"
	"commons/dto"
	"context"
)

type UserRepository interface {
	Repository
	FindByUsername(ctx context.Context, username string, user *domain.User) error
	FindByEmail(ctx context.Context, email string, user *domain.User) error
	FindByUsernameOrEmail(ctx context.Context, username string, email string, user *domain.User) error
	FilterUsers(ctx context.Context, filter *filter.UserFilter, users *[]domain.User, page *dto.PageInfo) error
}
