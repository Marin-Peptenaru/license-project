package apperrors

import (
	"fmt"
	"net/http"
)

type ErrFailedDecoding struct {
	msg string
}

func (e ErrFailedDecoding) Error() string {
	return e.msg
}

func (e ErrFailedDecoding) StatusCode() int {
	return http.StatusInternalServerError
}

func FailedDecoding(msg string) error {
	return &ErrFailedDecoding{
		msg: fmt.Sprintf("could not decode data: %s", msg),
	}
}
