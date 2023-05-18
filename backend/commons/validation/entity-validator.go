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
	/*parsedId, err := uuid.Parse(e.ID())

	if err != nil {
		return apperrors.InvalidEntity(fmt.Sprintf("invalid entity: invalid id: %s", parsedId.String()))
	}

	if parsedId.String() != e.ID() {
		return fmt.Errorf("invalid entity: could not parse id correctly: %s != %s", parsedId.String(), e.ID())
	}*/

	return nil
}
