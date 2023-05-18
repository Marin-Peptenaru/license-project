package domain

import "github.com/kamva/mgm/v3"

type Topic struct {
	mgm.DefaultModel `bson:"inline"`
	Title            string   `json:"title,omitempty"`
	Admin            string   `json:"admin,omitempty"`
	Public           bool     `json:"public,omitempty"`
	Pswd             Password `json:"-" bson:"pswd"`
}

func (t *Topic) ID() string {
	return t.DefaultModel.ID.Hex()
}
