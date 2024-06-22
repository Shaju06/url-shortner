package routes

import (
	"github/varinder/url-shortner/database"
	"github/varinder/url-shortner/helpers"
	"os"
	"strconv"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
)

type req struct {
	Url         string        `json:"url"`
	CustomShort string        `json:"short"`
	Expiry      time.Duration `json:"expiry"`
}

type res struct {
	Url             string        `json:"url"`
	CustomShort     string        `json:"short"`
	Expiry          time.Duration `json:"expiry"`
	XRateRemaining  int           `json:"rateLimit"`
	XRatelimitReset time.Duration `json:"rateLimitReset"`
}

func ShortenURL(ctx *fiber.Ctx) error {
	body := new(req)

	if err := ctx.BodyParser(&body); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse json"})
	}

	// rate limiting

	rDb := database.CreateClient(1)

	value, err := rDb.Get(database.Ctx, ctx.IP()).Result()

	if err == redis.Nil {
		_ = rDb.Set(database.Ctx, ctx.IP(), os.Getenv("API_QOUTA"), 30*60*time.Second).Err()
	} else {
		value, _ = rDb.Get(database.Ctx, ctx.IP()).Result()
		valInt, _ := strconv.Atoi(value)

		if valInt < 1 {
			limit, _ := rDb.TTL(database.Ctx, ctx.IP()).Result()
			return ctx.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error":            "exceeded rate limit.",
				"rate_limit_reset": limit / time.Nanosecond / time.Minute,
			})
		}
	}

	if !govalidator.IsURL(body.Url) {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid url"})
	}

	if !helpers.RemoveDominError(body.Url) {
		return ctx.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Something went wrong, Try again"})
	}

	body.Url = helpers.EnforceHTTP(body.Url)

	rDb.Decr(database.Ctx, ctx.IP())

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"success": "Request proceed successfully"})
}
