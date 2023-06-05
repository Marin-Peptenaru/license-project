package apperrors

import (
	"commons/utils"
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
	errMsg := fmt.Sprintf("duplicate entity: %s", msg)
	utils.Logger.Error(errMsg)

	return &ErrDuplicateEntity{
		msg: errMsg,
	}
}
