package cache

import (
	"commons/config"
	"commons/utils"
	"time"

	"github.com/gomodule/redigo/redis"
)

type CacheMap interface {
	SetWithExpire(key string, value string, expire time.Duration) error
	Set(key string, value string) error
	Get(key string) (string, error)
	Remove(keys ...string) error
}

type redisCacheMap struct {
	p *redis.Pool
}

func (r redisCacheMap) Get(key string) (string, error) {
	conn := r.p.Get()
	defer conn.Close()

	reply, err := redis.String(conn.Do("GET", key))

	if err != nil {
		return "", err
	}

	return reply, nil
}

func (r *redisCacheMap) SetWithExpire(key string, value string, expire time.Duration) error {
	conn := r.p.Get()
	defer conn.Close()

	_, err := conn.Do("SET", key, value, "PX", expire.Milliseconds())
	return err
}

func (r *redisCacheMap) Set(key string, value string) error {
	conn := r.p.Get()
	defer conn.Close()

	_, err := conn.Do("SET", key, value)
	return err
}

func (r *redisCacheMap) Remove(keys ...string) error {
	conn := r.p.Get()
	defer conn.Close()

	_, err := conn.Do("DEL", keys)
	return err
}

func NewCache(cfg *config.Config) CacheMap {
	return &redisCacheMap{
		p: utils.RedisPool(),
	}
}
