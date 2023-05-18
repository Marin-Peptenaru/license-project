package domain

import "github.com/kamva/mgm/v3"

type Message struct {
	mgm.DefaultModel `bson:"inline"`
	Content          string `json:"content"`
	From             string `json:"from"`
	To               string `json:"to"`
	Timestamp        int64  `json:"timestamp"`
}

func (m *Message) ID() string {
	return m.DefaultModel.ID.Hex()
}
