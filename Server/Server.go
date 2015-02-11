package main

import (
	"./src/controllers"
	"./src/encoding"
	"./src/models"
	"./src/utility"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/binding"
	"github.com/martini-contrib/cors"
	"github.com/martini-contrib/render"
	// "log"
	// "net/http"
	"runtime"
)

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())

	martini.Env = martini.Prod
	m := martini.Classic()
	m.Use(render.Renderer())
	m.Use(encoding.MapEncoder)
	m.Use(models.InitDB())
	m.Use(models.InitRabbitMQ())
	//log.Fatal(http.ListenAndServe(":10600", m))
	f := utility.InitLogger(m)
	defer f.Close()

	m.Use(cors.Allow(&cors.Options{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "GET", "POST", "DELETE"},
		AllowHeaders:     []string{"Application-Id", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	m.Run()
}
