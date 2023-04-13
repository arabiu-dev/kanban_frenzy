package database

import (
	"log"
	"os"

	"github.com/arabiu-dev/frenzy_kanban/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init() *gorm.DB {
	db, err := gorm.Open(postgres.Open(os.Getenv("DB_URL")), &gorm.Config{})

	if err != nil {
		log.Fatalln(err)
	}

	db.AutoMigrate(&models.User{}, &models.Board{}, &models.Column{}, &models.Task{}, &models.SubTask{})

	return db
}

var DB *gorm.DB = Init()
