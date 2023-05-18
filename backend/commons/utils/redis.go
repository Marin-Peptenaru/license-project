package utils

import (
	"github.com/gomodule/redigo/redis"
)

func NewRedisPool() *redis.Pool {
	return &redis.Pool{
		MaxIdle:   10,
		MaxActive: 100,
		//IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			conn, err := redis.Dial("tcp", "localhost:6379")

			if err != nil {
				panic(err.Error())
			}

			return conn, err
		},
	}
}
