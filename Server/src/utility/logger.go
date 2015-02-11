package utility

import (
	"github.com/go-martini/martini"
	"log"
	"os"
)

func InitLogger(m *martini.ClassicMartini) *os.File {
	f, err := os.OpenFile("logfile", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}

	m.Map(log.New(f, "[martini]", log.LstdFlags))
	return f
}
