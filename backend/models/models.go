package models

type User struct {
	ID       uint    `gorm:"primaryKey" json:"id" sql:"auto_increment"`
	Username string  `gorm:"unique" json:"username" validate:"required"`
	Password string  `json:"password" validate:"required,min=6"`
	Token    string  `json:"token"`
	Board    []Board `json:"-" gorm:"many2many:user_boards;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type Board struct {
	ID       uint     `gorm:"primaryKey" json:"id" sql:"auto_increment"`
	Name     string   `json:"name" validate:"required"`
	IsActive bool     `json:"isActive" validate:"required"`
	Column   []Column `json:"columns" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Users    []User   `json:"user_id" gorm:"many2many:user_boards;"`
}

type Column struct {
	ID      uint   `gorm:"primaryKey" json:"id" sql:"auto_increment"`
	Name    string `json:"name" validate:"required"`
	Task    []Task `json:"tasks" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	BoardID uint   `json:"board_id"`
}

type Task struct {
	ID          uint      `gorm:"primaryKey" json:"id" sql:"auto_increment"`
	Title       string    `json:"title" validate:"required"`
	Color       string    `json:"color"`
	Description string    `json:"description"`
	Status      string    `json:"status" validate:"required"`
	SubTask     []SubTask `json:"subtasks" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	ColumnID    uint      `json:"column_id"`
}

type SubTask struct {
	ID          uint   `gorm:"primaryKey" json:"id" sql:"auto_increment"`
	Title       string `json:"title" validate:"required"`
	IsCompleted bool   `json:"isCompleted" validate:"required"`
	TaskID      uint   `json:"task_id"`
}
