package apperrors

import (
	"commons/utils"
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
	errMsg := fmt.Sprintf("could not decode data: %s", msg)
	utils.Logger().Error(errMsg)

	return &ErrFailedDecoding{
		msg: errMsg,
	}
}
