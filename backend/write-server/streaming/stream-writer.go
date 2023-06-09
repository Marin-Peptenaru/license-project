package streaming

import (
	"commons/apperrors"
	"commons/utils"
	"encoding/json"

	"github.com/gomodule/redigo/redis"
	"go.uber.org/zap"
)

type StreamWriter[T any] interface {
	Write(key string, entry T) error
}

type streamWriter[T any] struct {
	stream string
	pool   *redis.Pool
}

func (s streamWriter[T]) Write(key string, entry T) error {
	marshalledEntry, err := json.Marshal(entry)

	if err != nil {
		return apperrors.FailedMarshalling(err.Error())
	}

	conn := s.pool.Get()
	defer conn.Close()

	_, err = conn.Do("XADD", s.stream, "*", key, string(marshalledEntry))

	utils.Logger.Info("entry written to stream",
		zap.String("stream", s.stream),
		zap.String("entry", string(marshalledEntry)),
	)

	return err
}

func NewStreamWriter[T any](stream string) StreamWriter[T] {
	p := utils.RedisPool()

	return streamWriter[T]{
		stream: stream,
		pool:   p,
	}
}
