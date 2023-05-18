package apperrors

import (
	"fmt"
	"net/http"
)

type ErrInvalidEntity struct {
	msg string
}

func (e ErrInvalidEntity) Error() string {
	return e.msg
}

func (e ErrInvalidEntity) StatusCode() int {
	return http.StatusBadRequest
}

func InvalidEntity(msg string) error {
	return &ErrInvalidEntity{
		msg: fmt.Sprintf("invalid entity: %s", msg),
	}
}
