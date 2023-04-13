package controllers

import (
	"fmt"
	"net/http"

	"github.com/arabiu-dev/frenzy_kanban/helpers"
	"github.com/arabiu-dev/frenzy_kanban/models"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

var validate = validator.New()

type Handler struct {
	DB *gorm.DB
}

func (h Handler) Signup() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		body := models.UserRequestBody{}

		if err := ctx.BindJSON(&body); err != nil {
			ctx.AbortWithError(http.StatusBadRequest, err)
			return
		}

		validationErr := validate.Struct((body))
		if validationErr != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		var user models.User
		var count int64
		if h.DB.Model(&user).Where("username = ?", body.Username).
			Count(&count); count > 0 {
			ctx.JSON(409, gin.H{"error": "Username already exists"})
			return
		}

		user.Username = body.Username
		user.Password = helpers.HashPassword(body.Password)
		if result := h.DB.Create(&user); result.Error != nil {
			ctx.JSON(http.StatusConflict,
				gin.H{"error": "User creation was not successfull"})
			return
		}

		token, _ := helpers.GenerateToken(user.Username, fmt.Sprintf("%v", user.ID))
		helpers.UpdateAllTokens(token, user.ID)

		ctx.Header("token", token)
		ctx.JSON(http.StatusCreated, &user)
	}
}

func (h Handler) Signin() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		body := models.UserRequestBody{}

		if err := ctx.BindJSON(&body); err != nil {
			ctx.AbortWithError(http.StatusBadRequest, err)
			return
		}

		var user models.User
		if result := h.DB.
			Where("username = ?", body.Username).
			First(&user); result.Error != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Username or password is incorrect"})
			return
		}

		passwordIsValid, msg := helpers.VerifyPassword(body.Password, user.Password)
		if !passwordIsValid {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		token, _ := helpers.GenerateToken(user.Username, fmt.Sprintf("%v", user.ID))
		helpers.UpdateAllTokens(token, user.ID)

		if result := h.DB.
			Where("username = ?", body.Username).First(&user); result.Error != nil {
			ctx.AbortWithError(http.StatusInternalServerError, result.Error)
			return
		}

		ctx.Header("token", token)
		ctx.JSON(http.StatusOK, &user)
	}
}

func (h Handler) CreateBoard() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		body := models.Board{}

		if err := ctx.BindJSON(&body); err != nil {
			ctx.AbortWithError(http.StatusBadRequest, err)
			return
		}

		var user models.User
		if result := h.DB.Preload("Board.Column.Task.SubTask").
			Where("username = ?", ctx.GetString("username")).
			First(&user); result.Error != nil {
			ctx.JSON(http.StatusInternalServerError,
				gin.H{"error": "Something went wrong"})
			return
		}

		user.Board = append(user.Board, body)
		h.DB.Save(&user)

		ctx.Status(http.StatusCreated)
	}
}

func (h Handler) UpdateBoard() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		body := models.Board{}

		if err := ctx.BindJSON(&body); err != nil {
			ctx.AbortWithError(http.StatusBadRequest, err)
			return
		}

		var board models.Board
		if result := h.DB.Preload("Column.Task.SubTask").First(&board, body.ID); result.Error != nil {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "Board is not found"})
			return
		}

		if len(board.Column) != 0 {
			h.DB.Delete(&board.Column)
		}

		if err := h.DB.Session(&gorm.Session{FullSaveAssociations: false}).
			Updates(&body).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}

		ctx.Status(http.StatusOK)
	}
}

func (h Handler) ShareBoard() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		body := models.SharedRequestBody{}

		if err := ctx.BindJSON(&body); err != nil {
			ctx.AbortWithError(http.StatusBadRequest, err)
			return
		}

		var user models.User
		if result := h.DB.Preload("Board.Column.Task.SubTask").
			Where("username = ?", body.Username).
			First(&user); result.Error != nil {
			ctx.AbortWithError(http.StatusNotFound, result.Error)
			return
		}

		user.Board = append(user.Board, body.Board)
		h.DB.Save(&user)

		ctx.Status(http.StatusCreated)
	}
}

func (h Handler) DeleteBoard() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		boardId := ctx.Param("b_id")

		var board models.Board
		if result := h.DB.First(&board, boardId); result.Error != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Board is not found"})
			return
		}
		h.DB.Model(&board).Association("Users").Clear()

		if result := h.DB.Delete(&board); result.Error != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Board could'nt be deleted."})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Board deleted successfully."})
	}
}

func (h Handler) GetBoards() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var board []models.Board
		if result := h.DB.Preload("Column.Task.SubTask").
			Joins("inner join user_boards ub on ub.board_id = boards.id ").
			Joins("inner join users on users.id = ub.user_id ").
			Where("users.id = ?", ctx.GetString("user_id")).
			Find(&board); result.Error != nil {
			ctx.AbortWithError(http.StatusNotFound, result.Error)
			return
		}
		ctx.JSON(http.StatusOK, board)
	}
}
