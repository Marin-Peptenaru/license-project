package controller

import (
	c "commons/controller"
	"commons/dto"
	"commons/middleware"
	httputils "commons/utils/http-utils"
	"encoding/json"
	"net/http"
	"write-server/service"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
)

type AuthenticationController interface {
	c.Controller
	Login(w http.ResponseWriter, r *http.Request)
	Logout(w http.ResponseWriter, r *http.Request)
	RefreshToken(w http.ResponseWriter, r *http.Request)
}

type authController struct {
	auth service.AuthenticationService
}

func (a *authController) Logout(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract token", http.StatusUnauthorized)
		return
	}

	userId := claims["user_id"].(string)

	if err = a.auth.EndSession(userId); err != nil {
		httputils.RespondWithError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (a *authController) RefreshToken(w http.ResponseWriter, r *http.Request) {
	_, claims, err := jwtauth.FromContext(r.Context())

	if err != nil {
		http.Error(w, "could not extract token", http.StatusUnauthorized)
		return
	}

	userId := claims["user_id"].(string)
	tokenString := r.Header.Get("Authorization")[7:]

	newToken, err := a.auth.RefreshToken(userId, tokenString)

	if err != nil {
		httputils.RespondWithError(w, err)
		return
	}

	w.Write([]byte(newToken))
}

func (a *authController) Login(w http.ResponseWriter, r *http.Request) {

	userData := dto.UserDTO{}

	err := json.NewDecoder(r.Body).Decode(&userData)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	token, refresh, err := a.auth.Authenticate(userData.Username, userData.Email, userData.Password)

	if err != nil {
		httputils.RespondWithError(w, err)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"auth":    token,
		"refresh": refresh,
	})
}

func (a *authController) InitEndpoints(r chi.Router) {
	r.Route("/api/auth", func(authApi chi.Router) {
		authApi.Post("/", a.Login)
	})

	r.Route("/api/auth/logout", func(r chi.Router) {
		r.Use(middleware.JwtVerifier)
		r.Use(jwtauth.Authenticator)
		r.Use(middleware.TokenMustBeRefresh)

		r.Put("/", a.Logout)
	})

	r.Route("/api/auth/refresh", func(r chi.Router) {
		r.Use(middleware.JwtVerifier)
		r.Use(jwtauth.Authenticator)
		r.Use(middleware.TokenMustBeRefresh)

		r.Post("/", a.RefreshToken)
	})
}

func NewAuthenticationController(auth service.AuthenticationService) AuthenticationController {
	return &authController{
		auth,
	}
}
