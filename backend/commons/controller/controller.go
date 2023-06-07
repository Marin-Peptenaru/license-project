package controller

import (
	"github.com/go-chi/chi/v5"
)

type Controller interface {
	InitEndpoints(r chi.Router)
}
