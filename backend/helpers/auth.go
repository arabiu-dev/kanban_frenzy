package helpers

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/arabiu-dev/frenzy_kanban/database"
	"github.com/arabiu-dev/frenzy_kanban/models"
	jwt "github.com/dgrijalva/jwt-go"
)

type SignedDetails struct {
	Username string
	User_id  string
	jwt.StandardClaims
}

var SecretKey = os.Getenv("SKey")

func ValidateToken(signedToken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&SignedDetails{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(SecretKey), nil
		})

	if err != nil {
		msg = err.Error()
		return claims, msg
	}

	claims, ok := token.Claims.(*SignedDetails)

	if !ok || claims.ExpiresAt < time.Now().Local().Unix() {
		msg = err.Error()
	}

	return claims, msg
}

func GenerateToken(username string, user_id string) (token string, err error) {
	claims := &SignedDetails{
		Username: username,
		User_id:  user_id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(24)).Unix(),
		},
	}

	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).
		SignedString([]byte(SecretKey))
}

func UpdateAllTokens(token string, user_id uint) {
	var c, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	db := database.DB
	var user models.User

	defer cancel()

	if result := db.WithContext(c).First(&user, user_id); result.Error != nil {
		log.Println(result.Error)
		return
	}

	user.Token = token
	db.Save(&user)
}
