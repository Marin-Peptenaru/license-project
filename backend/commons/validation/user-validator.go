package validation

import (
	"commons/apperrors"
	"commons/domain"
	"fmt"
	"regexp"
	"strings"
)

func ValidateUser(user domain.User) error {
	usernameErr := validateUsername(user.Username)
	emailErr := validateEmail(user.Email)

	errBuilder := strings.Builder{}
	appendErrorIfNotNil(&errBuilder, usernameErr)
	appendErrorIfNotNil(&errBuilder, emailErr)

	if errBuilder.Len() != 0 {
		return apperrors.InvalidEntity(errBuilder.String())
	}

	return nil
}

func ValidatePassword(password string) error {
	if len(password) < 12 {
		return apperrors.InvalidCredentials("password is too weak")
	}
	return nil
}

func validateUsername(username string) error {

	if len(username) < 5 {
		return fmt.Errorf("username is too short")
	}

	return nil
}

func validateEmail(email string) error {

	valid, err := regexp.MatchString("^.*@.*\\..*", email)

	if err != nil {
		return fmt.Errorf("could not verify email validity: %s", err.Error())
	}

	if !valid {
		return fmt.Errorf("invalid email address: %s", email)
	}

	return nil
}
