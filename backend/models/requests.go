package models

type UserRequestBody struct {
	Username string `gorm:"unique" json:"username" validate:"required"`
	Password string `json:"password" validate:"required,min=6"`
}

type SharedRequestBody struct {
	Username string `gorm:"unique" json:"username" validate:"required"`
	Board    Board  `json:"board" validate:"required"`
}
