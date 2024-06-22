package routes

import (
	"github/varinder/url-shortner/database"

	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
)

func ResolveURL(ctx *fiber.Ctx)  error{
url := ctx.Params("url")
r := database.CreateClient(0)

defer r.Close()

value, err := r.Get(database.Ctx, url).Result()

if err == redis.Nil {
	return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "Short url not found.",
	})
} else if err != nil {
	return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": "Cannot connect to  Db.",
	})
}

rInr := database.CreateClient(1)
	defer rInr.Close()
	_ = rInr.Incr(database.Ctx, "counter")
	
	return ctx.Redirect(value, 301)

}