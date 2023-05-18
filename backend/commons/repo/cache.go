package repo

import (
	"commons/utils"
	"github.com/gomodule/redigo/redis"
	"time"
)

type CacheMap interface {
	SetWithExpire(key string, value string, expire time.Duration) error
	Set(key string, value string) error
	Get(key string) (string, error)
	Remove(keys ...string) error
}

type redisCacheMap struct {
	p    *redis.Pool
	conn redis.Conn
}

func (r redisCacheMap) Get(key string) (string, error) {
	reply, err := redis.String(r.conn.Do("GET", key))

	if err != nil {
		return "", err
	}

	return reply, nil
}

func (r redisCacheMap) SetWithExpire(key string, value string, expire time.Duration) error {
	_, err := r.conn.Do("SET", key, value, "PX", expire.Milliseconds())
	return err
}

func (r redisCacheMap) Set(key string, value string) error {
	_, err := r.conn.Do("SET", key, value)

	return err
}

func (r redisCacheMap) Remove(keys ...string) error {
	_, err := r.conn.Do("DEL", keys)
	return err
}

func NewCache() CacheMap {
	pool := utils.NewRedisPool()
	conn := pool.Get()

	return redisCacheMap{
		p:    pool,
		conn: conn,
	}
}
