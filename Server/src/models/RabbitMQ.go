package models

import (
	"../../src"
	"github.com/go-martini/martini"
	"github.com/streadway/amqp"
)

func InitRabbitMQ() martini.Handler {
	rabbitmq := "amqp://" + config.RABBITMQ_USER + ":" + config.RABBITMQ_PASS + "@" + config.RABBITMQ_HOST + ":" + config.RABBITMQ_PORT
	conn, err := amqp.Dial(rabbitmq)
	if err != nil {
		panic(err)
	}

	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}
	defer ch.Close()

	ch.QueueDeclare(
		"email", // name
		true,    // durable
		false,   // delete when usused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)

	return func(c martini.Context) {
		ch, _ := conn.Channel()
		c.Map(ch)

		defer ch.Close()
		c.Next()
	}
}
