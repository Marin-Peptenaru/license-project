package service

import (
	"commons/apperrors"
	"commons/domain"
	"commons/repo"
	"commons/repo/cache"
	"commons/utils"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-chi/jwtauth/v5"
	"github.com/lestrrat-go/jwx/v2/jwt"
)

var ErrIncorrectCredentials = apperrors.InvalidCredentials("username/email or password are incorrect")

const authTokenDuration = 1000 * 24 * time.Hour
const refreshTokenDuration = 2 * time.Hour

type AuthenticationService interface {
	Authenticate(username string, email string, password string) (authToken string, refreshToken string, err error)
	EndSession(userId string) error
	RefreshToken(userId string, refreshToken string) (authToken string, err error)
}

type authService struct {
	users repo.UserRepository
	cache cache.CacheMap
}

func createTokenForUser(userId string, username string, duration time.Duration, isRefresh bool) (string, error) {
	claims := map[string]interface{}{
		"user_id": userId,
		"user":    username,
		"refresh": isRefresh,
	}

	jwtauth.SetIssuedNow(claims)
	jwtauth.SetExpiryIn(claims, duration)

	_, token, err := utils.JwtToken.Encode(claims)

	return token, err
}

func (a authService) EndSession(userId string) error {

	err := a.cache.Remove(userId)

	if err != nil {
		return fmt.Errorf("could not invalidate user session")
	}

	return nil
}

func (a authService) RefreshToken(userId string, refreshToken string) (authToken string, err error) {

	savedToken, err := a.cache.Get(userId)

	if err != nil {
		return "", fmt.Errorf("could get user data")
	}

	tokenHash := sha256.Sum256([]byte(refreshToken))
	marshalledHash, _ := json.Marshal(tokenHash)

	if savedToken != string(marshalledHash) {
		return "", apperrors.InvalidCredentials("invalid refresh token")
	}

	token, err := utils.JwtToken.Decode(refreshToken)
	id, _ := token.Get("user_id")
	username, _ := token.Get("user")

	if err != nil {
		return "", fmt.Errorf("could not decode token string")
	}

	if jwt.Validate(token) != nil {
		return "", apperrors.InvalidCredentials("invalid refresh token")
	}

	return createTokenForUser(id.(string), username.(string), authTokenDuration, false)

}

func (a authService) Authenticate(username string, email string, password string) (string, string, error) {

	user := &domain.User{}
	err := a.users.FindByUsernameOrEmail(a.users.Ctx(), username, email, user)

	if err != nil {
		return "", "", ErrIncorrectCredentials
	}

	if user.Pswd.Equals(password) {

		authToken, err := createTokenForUser(user.ID(), user.Username, authTokenDuration, false)

		if err != nil {
			return "", "", fmt.Errorf("could not generate auth token: %s", err.Error())
		}

		refreshToken, err := createTokenForUser(user.ID(), user.Username, refreshTokenDuration, true)

		if err != nil {
			return "", "", fmt.Errorf("could not generate refresh token: %s", err.Error())
		}

		tokenHash := sha256.Sum256([]byte(refreshToken))

		marshalledToken, _ := json.Marshal(tokenHash)

		err = a.cache.SetWithExpire(user.ID(), string(marshalledToken), refreshTokenDuration)

		if err != nil {
			return "", "", fmt.Errorf("could not update user session: %s", err.Error())
		}

		return authToken, refreshToken, nil
	} else {
		return "", "", ErrIncorrectCredentials
	}

}

func NewAuthService(users repo.UserRepository, cache cache.CacheMap) AuthenticationService {
	return authService{users: users, cache: cache}
}
