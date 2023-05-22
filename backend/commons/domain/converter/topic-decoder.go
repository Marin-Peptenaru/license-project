package converter

import (
	"commons/domain"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
)

type TopicBsonDecoder struct {
}

func (dec TopicBsonDecoder) Decode(raw bson.Raw, t domain.IsEntity) (domain.IsEntity, error) {
	if t == nil {
		t = &domain.Topic{}
	}

	topic, ok := t.(*domain.Topic)

	if !ok {
		return &domain.Topic{}, fmt.Errorf("wrong entity type passed as argument")
	}

	topic.DefaultModel.ID = raw.Lookup("_id").ObjectID()
	topic.Title = raw.Lookup("title").StringValue()
	topic.Admin = raw.Lookup("admin").StringValue()
	topic.Public = raw.Lookup("public").Boolean()
	err := raw.Lookup("pswd").Unmarshal(&topic.Pswd)

	if err != nil {
		return topic, fmt.Errorf("could not unmarshall password")
	}

	return topic, nil
}
