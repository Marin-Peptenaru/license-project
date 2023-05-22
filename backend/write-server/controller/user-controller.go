package controller

import (
	"commons/dto"
	"commons/service"
	"commons/utils"
	httputils "commons/utils/http-utils"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/jwtauth/v5"
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

	page := httputils.GetPageInfo(r)

	users, err := u.users.SearchUsers(searchKey, page)

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

	userId := claims["user_id"].(string)

	user, err := u.users.GetUser(userId)

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
