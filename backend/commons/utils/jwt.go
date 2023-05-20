package utils

import (
	"github.com/go-chi/jwtauth/v5"
)

const jwtSecret = "mysecret"

var JwtToken = jwtauth.New("HS256", []byte(jwtSecret), nil)
