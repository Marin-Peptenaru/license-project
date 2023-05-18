package repo

import (
	"commons/domain"
	"context"
)

type UserRepository interface {
	Repository
	FindByUsername(ctx context.Context, username string, user *domain.User) error
	FindByEmail(ctx context.Context, email string, user *domain.User) error
	FindByUsernameOrEmail(ctx context.Context, username string, email string, user *domain.User) error
	SearchByUsername(ctx context.Context, searchKey string, users *[]domain.User) error
}
