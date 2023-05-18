package streaming

import (
	"commons/apperrors"
	"commons/utils"
	"encoding/json"
	"fmt"
	"github.com/gomodule/redigo/redis"
)

type StreamWriter[T any] interface {
	Write(key string, entry T) error
}

type streamWriter[T any] struct {
	stream string
	conn   redis.Conn
	pool   *redis.Pool
}

func (s streamWriter[T]) Write(key string, entry T) error {
	marshalledEntry, err := json.Marshal(entry)

	if err != nil {
		return apperrors.FailedMarshalling(err.Error())
	}

	_, err = s.conn.Do("XADD", s.stream, "*", key, string(marshalledEntry))
	fmt.Println("notification sent")
	return err
}

func NewStreamWriter[T any](stream string) StreamWriter[T] {
	p := utils.NewRedisPool()
	c := p.Get()

	return streamWriter[T]{
		stream: stream,
		conn:   c,
		pool:   p,
	}
}
