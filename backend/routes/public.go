package routes

import (
	"github.com/arabiu-dev/frenzy_kanban/controllers"
	"github.com/arabiu-dev/frenzy_kanban/database"
	"github.com/gin-gonic/gin"
)

func Public(incomingRoute *gin.Engine) {
	h := &controllers.Handler{
		DB: database.DB,
	}

	v1 := incomingRoute.Group("api/v1/")
	{
		v1.POST("/signup", h.Signup())
		v1.POST("/signin", h.Signin())
	}
}
