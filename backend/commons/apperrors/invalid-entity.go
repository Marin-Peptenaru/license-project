package apperrors

import (
	"commons/utils"
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
	errMsg := fmt.Sprintf("invalid entity: %s", msg)
	utils.Logger.Error(errMsg)

	return &ErrInvalidEntity{
		msg: errMsg,
	}
}
