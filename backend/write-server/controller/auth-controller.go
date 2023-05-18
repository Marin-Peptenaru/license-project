package controller

import (
	"commons/dto"
	"commons/utils"
	"encoding/json"
	"github.com/go-chi/jwtauth/v5"
	"net/http"
	"write-server/service"
)

type AuthenticationController interface {
	Login(w http.ResponseWriter, r *http.Request)
	Logout(w http.ResponseWriter, r *http.Request)
	RefreshToken(w http.ResponseWriter, r *http.Request)
}

type authController struct {
	auth service.AuthenticationService
}

func (a authController) Logout(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract token", http.StatusUnauthorized)
		return
	}

	userId := claims["user_id"].(string)

	if err = a.auth.EndSession(userId); err != nil {
		utils.RespondWithError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (a authController) RefreshToken(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract token", http.StatusUnauthorized)
		return
	}

	userId := claims["user_id"].(string)
	tokenString := r.Header.Get("Authorization")[7:]

	newToken, err := a.auth.RefreshToken(userId, tokenString)

	if err != nil {
		utils.RespondWithError(w, err)
		return
	}

	w.Write([]byte(newToken))
}

func (a authController) Login(w http.ResponseWriter, r *http.Request) {

	userData := dto.UserDTO{}

	err := json.NewDecoder(r.Body).Decode(&userData)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	token, refresh, err := a.auth.Authenticate(userData.Username, userData.Email, userData.Password)

	if err != nil {
		if err == service.ErrIncorrectCredentials {
			utils.RespondWithError(w, err)
			return
		}

		utils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"auth":    token,
		"refresh": refresh,
	})
}

func NewAuthenticationController(auth service.AuthenticationService) AuthenticationController {
	return authController{
		auth,
	}
}
