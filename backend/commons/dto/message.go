package dto

type MessageDTO struct {
	Topic     string `json:"topic"`
	Content   string `json:"content"`
	Timestamp int64  `json:"timestamp"`
}
