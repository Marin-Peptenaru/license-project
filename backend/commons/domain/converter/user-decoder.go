package converter

import (
	"commons/domain"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
)

type UserBsonDecoder struct {
}

func (dec UserBsonDecoder) Decode(raw bson.Raw, u domain.IsEntity) (domain.IsEntity, error) {

	if u == nil {
		u = &domain.User{}
	}
	user, ok := u.(*domain.User)

	if !ok {
		return &domain.User{}, fmt.Errorf("wrong type passed for decoding")
	}

	user.DefaultModel.ID = raw.Lookup("_id").ObjectID()
	user.Username = raw.Lookup("username").StringValue()
	user.Email = raw.Lookup("email").StringValue()

	// TODO check errors returned by Unmarshal calls
	raw.Lookup("topics").Unmarshal(&user.Topics)
	raw.Lookup("createdtopics").Unmarshal(&user.CreatedTopics)
	raw.Lookup("pswd").Unmarshal(&user.Pswd)
	raw.Lookup("session").Unmarshal(&user.Session)

	return user, nil
}
