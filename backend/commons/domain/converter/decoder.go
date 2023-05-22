package converter

import (
	"commons/domain"
	"go.mongodb.org/mongo-driver/bson"
)

type EntityBsonDecoder interface {
	Decode(raw bson.Raw, entity domain.IsEntity) (domain.IsEntity, error)
}
