package validation

import (
	"commons/domain"
	"strings"
)

func appendErrorIfNotNil(b *strings.Builder, err error) {
	if err != nil {
		b.WriteString(err.Error())
		b.WriteString("\n")
	}
}

func ValidateEntity[T domain.IsEntity](e T) error {
	return nil
}
