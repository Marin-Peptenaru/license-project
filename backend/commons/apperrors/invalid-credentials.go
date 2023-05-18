package apperrors

import (
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
	return &ErrInvalidCredentials{
		msg: fmt.Sprintf("invalid credentials: %s", msg),
	}
}
