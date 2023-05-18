package apperrors

type StatusCodeError interface {
	StatusCode() int
}
