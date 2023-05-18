package streaming

import (
	"commons/utils"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/gomodule/redigo/redis"
	"github.com/leonsteinhaeuser/observer"
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
		log.Printf("could not persist processed event id for stream %s.\ncause: %s: ", s.stream, err.Error())
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
		fmt.Println(err.Error())
	}

	for _, item := range reply.([]any) {

		id := string(item.([]any)[0].([]byte))
		data := item.([]any)[1].([]any)[1].([]byte)

		var event T
		err := json.Unmarshal(data, &event)

		if err != nil {
			log.Default().Printf("could not unmarshal a message fetched from redis: %s | %s",
				string(data), err.Error())
			continue
		}

		select {
		case <-s.ctx.Done():
			break
		default:
			fmt.Printf(">>>> event sent to channel %s: ", event)
			s.obs.NotifyAll(event)
			s.updateLastEventId(id)
		}

		fmt.Printf("ID: %s\n", id)
		fmt.Printf("Data: %s\n", data)
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
		log.Printf("could not read persisted latest event id for stream %s.\n cause: %s", obs.stream, err.Error())
	} else {
		obs.latestEventId = string(persistedId)
	}

	return obs
}
