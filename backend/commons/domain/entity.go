package domain

import (
	"github.com/kamva/mgm/v3"
)

type IsEntity interface {
	mgm.Model
	ID() string
}
