package service

import (
	"commons/domain"
	"write-server/streaming"
)

type MessageNotifier interface {
	Notify(msg domain.Message)
}

type msgNotifier struct {
	writer streaming.StreamWriter[domain.Message]
}

func (m msgNotifier) Notify(msg domain.Message) {
	m.writer.Write("msg", msg)
}

func NewMessageNotifier() MessageNotifier {

	return msgNotifier{
		writer: streaming.NewStreamWriter[domain.Message]("msg-stream"),
	}
}
