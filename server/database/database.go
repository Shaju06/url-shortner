package database

import (
	"context"
	"os"

	"github.com/redis/go-redis/v9"
)


var Ctx = context.Background()

func CreateClient(dbNo int) *redis.Client {
	redis := redis.NewClient(&redis.Options{
		Addr: os.Getenv("DB_ADDRS"),
		Password: os.Getenv("DB_PASS"),
		DB: dbNo,
	})

	return redis
}