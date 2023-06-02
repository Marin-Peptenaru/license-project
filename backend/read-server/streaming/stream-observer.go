package streaming

import (
	"commons/utils"
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/gomodule/redigo/redis"
	"github.com/leonsteinhaeuser/observer"
	"go.uber.org/zap"
)

type StreamObserver[T any] interface {
	StartObserving()
	Subscribe() (<-chan T, observer.CancelFunc)
}

type streamObserver[T any] struct {
	conn              redis.Conn
	pool              *redis.Pool
	stream            string
	obs               *observer.Observer[T]
	latestEventId     string
	latestEventIdFile string
	ctx               context.Context
}

func (s streamObserver[T]) StartObserving() {
	go func() {
		notCancelled := true
		for notCancelled {
			select {
			case <-s.ctx.Done():
				notCancelled = false
			default:
				s.checkForNewMessages()
			}
		}
	}()
}

func (s *streamObserver[T]) updateLastEventId(eventId string) {
	s.latestEventId = eventId
	err := os.WriteFile(s.latestEventIdFile, []byte(s.latestEventId), 0666)
	if err != nil {
		utils.Logger().Warn("could not persist processed event id for stream",
			zap.String("stream", s.stream),
			zap.Error(err),
		)
	}
}

func (s streamObserver[T]) Subscribe() (<-chan T, observer.CancelFunc) {
	return s.obs.Subscribe()
}

func (s *streamObserver[T]) checkForNewMessages() {
	lowerBoundId := s.latestEventId

	if lowerBoundId != "-" {
		lowerBoundId = "(" + s.latestEventId
	}

	reply, err := s.conn.Do("XRANGE", s.stream, lowerBoundId, "+")

	if err != nil {
		utils.Logger().Error("error reading from stream",
			zap.Error(err),
		)
	}

	done := false

	for _, item := range reply.([]any) {

		id := string(item.([]any)[0].([]byte))
		data := item.([]any)[1].([]any)[1].([]byte)

		var event T
		err := json.Unmarshal(data, &event)

		if err != nil {
			utils.Logger().Warn("could not unmarshal message from redis",
				zap.String("message data", string(data)),
				zap.Error(err),
			)
			continue
		}

		select {
		case <-s.ctx.Done():
			done = true
		default:
			s.obs.NotifyAll(event)
			s.updateLastEventId(id)
			utils.Logger().Info("event sent to observing channels",
				zap.String("event id", id),
				zap.Any("event", event),
			)
		}

		if done {
			break
		}
	}
}

func NewStreamObserver[T any](stream string, ctx context.Context) StreamObserver[T] {
	p := utils.NewRedisPool()
	c := p.Get()

	obs := streamObserver[T]{
		conn:              c,
		pool:              p,
		stream:            stream,
		obs:               observer.NewObserver[T](),
		latestEventId:     "-",
		latestEventIdFile: fmt.Sprintf("latestId-%s.txt", stream),
		ctx:               ctx,
	}

	persistedId, err := os.ReadFile(obs.latestEventIdFile)

	if err != nil {
		utils.Logger().Warn("could not read persisted latest event id for stream", zap.String("stream", obs.stream), zap.Error(err))
	} else {
		obs.latestEventId = string(persistedId)
	}

	return obs
}
