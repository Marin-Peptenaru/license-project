package repo

import (
	"context"
	"fmt"
	"github.com/kamva/mgm/v3"
)

var (
	ErrNoMatchingEntity = fmt.Errorf("no matching entity found")
)

type Repository interface {
	Add(ctx context.Context, entity mgm.Model) error
	Remove(ctx context.Context, entity mgm.Model) error
	Update(ctx context.Context, entity mgm.Model) error
	FindById(ctx context.Context, id string, model mgm.Model) error
	FindAll(ctx context.Context, entities *[]mgm.Model) error
	Ctx() context.Context
}
