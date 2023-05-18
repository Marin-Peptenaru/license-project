package apperrors

import (
	"fmt"
	"net/http"
)

type ErrFailedMarshalling struct {
	msg string
}

func (e ErrFailedMarshalling) Error() string {
	return e.msg
}

func (e ErrFailedMarshalling) StatusCode() int {
	return http.StatusInternalServerError
}

func FailedMarshalling(msg string) error {
	return &ErrFailedMarshalling{
		msg: fmt.Sprintf("failed to marshall data: %s", msg),
	}
}
