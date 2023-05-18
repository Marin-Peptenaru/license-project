package controller

import (
	"commons/dto"
	"commons/service"
	"commons/utils"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/jwtauth/v5"
	"net/http"
)

type UserController interface {
	RegisterUser(w http.ResponseWriter, r *http.Request)
	UserDetails(w http.ResponseWriter, r *http.Request)
	SearchUsers(w http.ResponseWriter, r *http.Request)
}

type userController struct {
	users service.UserService
}

func (u userController) SearchUsers(w http.ResponseWriter, r *http.Request) {
	searchKey := chi.URLParam(r, "username-search-key")

	users, err := u.users.SearchUsers(searchKey)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(users)
}

func (u userController) RegisterUser(w http.ResponseWriter, r *http.Request) {
	userData := dto.UserDTO{}

	err := json.NewDecoder(r.Body).Decode(&userData)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(fmt.Sprintf("error decoding request body: %s", err.Error())))
		return
	}

	newUser, err := u.users.RegisterUser(userData.Username, userData.Password, userData.Email)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(newUser)

}

func (u userController) UserDetails(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract user claims", http.StatusUnauthorized)
		return
	}

	username := claims["user"].(string)

	user, err := u.users.UserDetails(username, "")

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(user)

}

func NewUserController(users service.UserService) UserController {
	return userController{
		users: users,
	}
}
