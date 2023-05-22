package service

import (
	"commons/apperrors"
	"commons/domain"
	"commons/dto"
	"commons/repo"
	"commons/repo/transaction"
	"commons/validation"
	"fmt"
	"strings"
)

type UserService interface {
	RegisterUser(username string, password string, email string) (user *domain.User, err error)
	GetUser(userId string) (*domain.User, error)
	UserDetails(username string, email string) (*domain.User, error)
	SearchUsers(usernameSearchKey string, page *dto.PageInfo) ([]domain.User, error)
}

type userServ struct {
	users repo.UserRepository
}

func (u userServ) SearchUsers(usernameSearchKey string, page *dto.PageInfo) ([]domain.User, error) {
	usernameSearchKey = strings.TrimSpace(usernameSearchKey)

	if len(usernameSearchKey) != 0 {
		users := make([]domain.User, 0)
		err := u.users.SearchByUsername(u.users.Ctx(), usernameSearchKey, &users, page)
		return users, err
	}

	return []domain.User{}, nil
}

func (u userServ) GetUser(userId string) (*domain.User, error) {
	user := &domain.User{}

	err := u.users.FindById(u.users.Ctx(), userId, user)

	if err != nil {
		if err == repo.ErrNoMatchingEntity {
			if err == repo.ErrNoMatchingEntity {
				return &domain.User{}, apperrors.InvalidEntity("no user with specified username or email")
			}
			return &domain.User{}, err
		}
	}

	return user, err
}

func (u userServ) UserDetails(username string, email string) (*domain.User, error) {
	user := &domain.User{}
	err := u.users.FindByUsernameOrEmail(u.users.Ctx(), username, email, user)

	if err != nil {
		if err == repo.ErrNoMatchingEntity {
			return &domain.User{}, apperrors.InvalidEntity("no user with specified username or email")
		}
		return &domain.User{}, err
	}

	return user, err
}

func (u userServ) RegisterUser(username string, password string, email string) (user *domain.User, err error) {
	err = validation.ValidatePassword(password)

	if err != nil {
		return &domain.User{}, err
	}

	pswd := domain.NewPassword(password)

	user = &domain.User{
		Username:      username,
		Email:         email,
		Pswd:          pswd,
		Topics:        make(map[string]bool),
		CreatedTopics: make(map[string]bool),
	}

	err = validation.ValidateUser(*user)

	if err != nil {
		return &domain.User{}, err
	}

	err = transaction.Do(func(s transaction.Scope) error {
		otherUser := &domain.User{}
		err = u.users.FindByUsernameOrEmail(s.Ctx(), username, email, otherUser)

		if err != repo.ErrNoMatchingEntity {

			if otherUser.Username == username {
				return apperrors.InvalidCredentials(fmt.Sprintf("username %s or email %s already in use", username, email))
			}

			return err
		}

		err = u.users.Add(s.Ctx(), user)

		if err != nil {
			return err
		}

		return s.Commit()
	})

	return user, err
}

func NewUserService(repo repo.UserRepository) UserService {
	return &userServ{
		users: repo,
	}
}
