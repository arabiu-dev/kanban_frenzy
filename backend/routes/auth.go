package routes

import (
	"github.com/arabiu-dev/frenzy_kanban/controllers"
	"github.com/arabiu-dev/frenzy_kanban/database"
	"github.com/arabiu-dev/frenzy_kanban/middleware"
	"github.com/gin-gonic/gin"
)

func Auth(incomingRoute *gin.Engine) {
	h := &controllers.Handler{
		DB: database.DB,
	}

	v1 := incomingRoute.Group("api/v1/auth/")
	{
		v1.Use(middleware.Authenticate())
		v1.POST("/create", h.CreateBoard())
		v1.POST("/share", h.ShareBoard())
		v1.DELETE("/delete/:b_id", h.DeleteBoard())
		v1.PUT("/update", h.UpdateBoard())
		v1.GET("/boards", h.GetBoards())
	}
}
