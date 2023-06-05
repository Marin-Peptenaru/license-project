package utils

import (
	"commons/config"

	"github.com/go-chi/jwtauth/v5"
)

var JwtToken *jwtauth.JWTAuth

func InitJwtToken(cfg *config.Config) {
	JwtToken = jwtauth.New("HS256", []byte(cfg.Security.TokenSecret), nil)
}
