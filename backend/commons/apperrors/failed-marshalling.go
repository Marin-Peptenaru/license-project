package apperrors

import (
	"commons/utils"
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
	errMsg := fmt.Sprintf("failed to marshall data: %s", msg)
	utils.Logger().Error(errMsg)

	return &ErrFailedMarshalling{
		msg: errMsg,
	}
}
