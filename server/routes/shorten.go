package routes

import (
	"github/varinder/url-shortner/database"
	"github/varinder/url-shortner/helpers"
	"os"
	"strconv"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
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

	/*
	*	check if there's custom short url provided by user
	*	if so, proceed.
	*	Otherwise, create new custom short url
	 */

	var id string = body.CustomShort

	if body.CustomShort == "" {
		id = uuid.New().String()[:6]
	}

	r := database.CreateClient(0)
	defer r.Close()

	value, _ = r.Get(database.Ctx, id).Result()

	if value != "" {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Url already in use",
		})
	}

	if body.Expiry == 0 {
		body.Expiry = 24 // default expiry of 24 hours
	}

	err = r.Set(database.Ctx, id, body.Url, body.Expiry*3600*time.Second).Err()

	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Unable to connect to server",
		})
	}

	response := res{
		Url:             body.Url,
		CustomShort:     "",
		Expiry:          body.Expiry,
		XRatelimitReset: 30,
		XRateRemaining:  10,
	}

	rDb.Decr(database.Ctx, ctx.IP())
	value, _ = rDb.Get(database.Ctx, ctx.IP()).Result()
	response.XRateRemaining, _ = strconv.Atoi(value)
	ttl, _ := rDb.TTL(database.Ctx, ctx.IP()).Result()
	response.XRatelimitReset = ttl / time.Nanosecond / time.Minute

	return ctx.Status(fiber.StatusOK).JSON(response)
}
