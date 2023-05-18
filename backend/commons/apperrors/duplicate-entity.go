package apperrors

import (
	"fmt"
	"net/http"
)

type ErrDuplicateEntity struct {
	msg string
}

func (e ErrDuplicateEntity) Error() string {
	return e.msg
}

func (e ErrDuplicateEntity) StatusCode() int {
	return http.StatusBadRequest
}

func DuplicateEntity(msg string) error {
	return &ErrDuplicateEntity{
		msg: fmt.Sprintf("duplicate entity: %s", msg),
	}
}
