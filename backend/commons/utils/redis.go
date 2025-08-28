package utils

import (
	"commons/config"
	"fmt"

	"github.com/gomodule/redigo/redis"
	"go.uber.org/zap"
)

var pool *redis.Pool

func InitRedisPool(cfg *config.Config) {

	Logger.Debug("using redis configuration", zap.String("redis", fmt.Sprintf("%s", cfg.Redis)))
	pool = &redis.Pool{
		MaxIdle:   cfg.Redis.MaxIdle,
		MaxActive: cfg.Redis.MaxActive,
		//IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			conn, err := redis.Dial(cfg.Redis.Protocol, cfg.Redis.Url)

			if err != nil {
				panic(err.Error())
			}

			return conn, err
		},
	}
}

func RedisPool() *redis.Pool {
	return pool
}
