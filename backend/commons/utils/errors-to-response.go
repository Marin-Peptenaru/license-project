package utils

import (
	"commons/apperrors"
	"net/http"
)

func ErrorToStatusCode(e error) int {
	statusCodeError, ok := e.(apperrors.StatusCodeError)

	if ok {
		return statusCodeError.StatusCode()
	}

	return http.StatusInternalServerError
}

func RespondWithError(w http.ResponseWriter, e error) {
	http.Error(w, e.Error(), ErrorToStatusCode(e))
}
