package domain

import "github.com/kamva/mgm/v3"

type User struct {
	mgm.DefaultModel `bson:"inline"`
	Username         string          `json:"username,omitempty"`
	Email            string          `json:"email,omitempty"`
	Pswd             Password        `json:"-" bson:"pswd"`
	Session          [32]byte        `json:"-" bson:"session"`
	Topics           map[string]bool `json:"topics,omitempty"`
	CreatedTopics    map[string]bool `json:"createdTopics,omitempty"`
}

func (u *User) ID() string {
	return u.DefaultModel.ID.Hex()
}
