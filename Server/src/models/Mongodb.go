package models

import (
	"../../src"
	"github.com/go-martini/martini"
	"gopkg.in/mgo.v2"
)

type MongoDB interface {
	//Insert(CollectionName string, docs ...interface{}) error
	// db.C("notice").Find(bson.M{}).All(&notices)
	// Get(id int) *Notice
	// GetAll() []*Notice
	// Find(band, title string, year int) []*Notice
	// Add(a *Notice) (int, error)
	// Update(a *Notice) error
	// Delete(id int)
}

func InitDB() martini.Handler {
	mongodb := config.MONGODB_HOST + ":" + config.MONGODB_PORT
	session, err := mgo.Dial(mongodb)
	if err != nil {
		panic(err)
	}

	return func(c martini.Context) {
		s := session.Clone()
		c.Map(s.DB(config.NAMESPACE + ":" + "haru"))

		defer s.Close()
		c.Next()
	}
}
