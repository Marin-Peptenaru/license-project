package dto

type TopicDTO struct {
	Id       string `json:"id"`
	Title    string `json:"title"`
	Public   bool   `json:"public"`
	Admin    string `json:"admin"`
	Password string `json:"password"`
}
