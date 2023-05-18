package converter

import (
	"commons/apperrors"
	"commons/domain"

	"go.mongodb.org/mongo-driver/bson"
)

type MessageBsonDecoder struct {
}

func (dec MessageBsonDecoder) Decode(raw bson.Raw, t domain.IsEntity) (domain.IsEntity, error) {
	if t == nil {
		t = &domain.Message{}
	}
	message, ok := t.(*domain.Message)

	if !ok {
		return &domain.Message{}, apperrors.FailedDecoding("wrong entity type: expected Message")
	}

	message.DefaultModel.ID = raw.Lookup("_id").ObjectID()
	message.To = raw.Lookup("to").StringValue()
	message.From = raw.Lookup("from").StringValue()
	message.Content = raw.Lookup("content").StringValue()
	message.Timestamp = raw.Lookup("timestamp").Int64()

	return message, nil
}
