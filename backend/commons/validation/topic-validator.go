package validation

import (
	"commons/apperrors"
	"commons/domain"
	"errors"
	"strings"
)

func ValidateTopic(topic domain.Topic) error {
	titleErr := validateTitle(topic.Title)

	errBuilder := strings.Builder{}

	appendErrorIfNotNil(&errBuilder, titleErr)

	if errBuilder.Len() != 0 {
		return apperrors.InvalidEntity(errBuilder.String())
	}

	return nil
}

func validateTitle(title string) error {
	if len(title) == 0 {
		return errors.New("topic title cannot be blank")
	}
	return nil
}
