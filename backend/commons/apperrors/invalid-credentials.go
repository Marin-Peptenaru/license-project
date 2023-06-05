package apperrors

import (
	"commons/utils"
	"fmt"
	"net/http"
)

type ErrInvalidCredentials struct {
	msg string
}

func (e ErrInvalidCredentials) Error() string {
	return e.msg
}

func (e ErrInvalidCredentials) StatusCode() int {
	return http.StatusUnauthorized
}

func InvalidCredentials(msg string) error {
	errMsg := fmt.Sprintf("invalid credentials: %s", msg)
	utils.Logger.Error(errMsg)

	return &ErrInvalidCredentials{
		msg: errMsg,
	}
}
