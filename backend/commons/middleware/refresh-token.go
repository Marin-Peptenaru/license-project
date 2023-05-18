package middleware

import (
	"github.com/go-chi/jwtauth/v5"
	"net/http"
)

func checkRefreshTokenClaims(next http.Handler, shouldBeRefresh bool) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, claims, err := jwtauth.FromContext(r.Context())

		if err != nil {
			http.Error(w, "could not extract claims", http.StatusInternalServerError)
			return
		}

		if shouldBeRefresh == claims["refresh"].(bool) {
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "invalid token", http.StatusUnauthorized)
		}
	})
}

func TokenMustBeRefresh(next http.Handler) http.Handler {
	return checkRefreshTokenClaims(next, true)
}

func TokenMustNotBeRefresh(next http.Handler) http.Handler {
	return checkRefreshTokenClaims(next, false)
}
