package controller

import (
	c "commons/controller"
	"commons/dto"
	"commons/middleware"
	"commons/service"
	httputils "commons/utils/http-utils"
	httpfilter "commons/utils/http-utils/http-filter"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
)

type UserController interface {
	c.Controller
	RegisterUser(w http.ResponseWriter, r *http.Request)
	UserDetails(w http.ResponseWriter, r *http.Request)
	SearchUsers(w http.ResponseWriter, r *http.Request)
}

type userController struct {
	users service.UserService
}

func (u *userController) SearchUsers(w http.ResponseWriter, r *http.Request) {
	page := httputils.GetPageInfo(r)
	filter := httpfilter.ExtractUserFilter(r)

	users, err := u.users.FilterUsers(filter, page)

	if err != nil {
		httputils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(users)
}

func (u *userController) RegisterUser(w http.ResponseWriter, r *http.Request) {
	userData := dto.UserDTO{}

	err := json.NewDecoder(r.Body).Decode(&userData)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(fmt.Sprintf("error decoding request body: %s", err.Error())))
		return
	}

	newUser, err := u.users.RegisterUser(userData.Username, userData.Password, userData.Email)

	if err != nil {
		httputils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(newUser)

}

func (u *userController) UserDetails(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract user claims", http.StatusUnauthorized)
		return
	}

	userId := claims["user_id"].(string)

	user, err := u.users.GetUser(userId)

	if err != nil {
		httputils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(user)

}
func (u *userController) InitEndpoints(r chi.Router) {
	r.Post("/api/register", u.RegisterUser)

	r.Route("/api/users", func(usersApi chi.Router) {
		usersApi.Use(middleware.JwtVerifier)
		usersApi.Use(jwtauth.Authenticator)
		usersApi.Use(middleware.TokenMustNotBeRefresh)

		usersApi.Get("/", u.UserDetails)
		usersApi.Get("/search/{username-search-key}", u.SearchUsers)

	})

}
func NewUserController(users service.UserService) UserController {
	return &userController{
		users: users,
	}
}
