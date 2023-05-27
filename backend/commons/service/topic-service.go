package service

import (
	"commons/apperrors"
	"commons/domain"
	"commons/domain/filter"
	"commons/dto"
	"commons/repo"
	"commons/repo/transaction"
	"commons/validation"
	"fmt"
	"strings"
)

type TopicService interface {
	// CreateTopic password parameter will be ignored if public is true
	CreateTopic(admin string, title string, public bool, password string) (topic *domain.Topic, err error)
	FilterTopics(filter *filter.TopicFilter, page *dto.PageInfo) ([]domain.Topic, error)
	TopicDetails(id string) (*domain.Topic, error)
	SubscribeToTopic(subscriber string, title string, password string) (*domain.User, *domain.Topic, error)
	UnsubscribeToTopic(username string, title string) (*domain.User, error)
	SubscribedTopics(userid string) ([]domain.Topic, error)
}

type topicService struct {
	users  repo.UserRepository
	topics repo.TopicRepository
}

func (t *topicService) FilterTopics(filter *filter.TopicFilter, page *dto.PageInfo) ([]domain.Topic, error) {
	topics := make([]domain.Topic, 0)
	err := t.topics.FilterTopics(t.topics.Ctx(), filter, &topics, page)
	return topics, err
}

func (t *topicService) SubscribedTopics(userId string) ([]domain.Topic, error) {
	user := &domain.User{}

	err := t.users.FindById(t.users.Ctx(), userId, user)

	if err != nil {
		if err == repo.ErrNoMatchingEntity {
			return []domain.Topic{}, apperrors.InvalidEntity("user does not exist")
		}
		return []domain.Topic{}, err
	}

	topics := make([]domain.Topic, len(user.Topics))
	i := 0
	topic := &domain.Topic{}

	for title := range user.Topics {
		err := t.topics.FindByTitle(t.topics.Ctx(), title, topic)
		if err != nil {
			fmt.Println(err)
		} else {
			topics[i] = *topic
		}
		i++
	}

	return topics, nil
}

func (t *topicService) TopicDetails(id string) (*domain.Topic, error) {

	topic := &domain.Topic{}
	err := t.topics.FindById(t.topics.Ctx(), id, topic)

	// just a debug print to check that the password field is unmarshalled properly
	fmt.Println(topic.Pswd)
	return topic, err
}

func (t *topicService) UnsubscribeToTopic(userId string, title string) (*domain.User, error) {
	user := &domain.User{}
	err := t.users.FindById(t.users.Ctx(), userId, user)

	if err != nil {
		if err == repo.ErrNoMatchingEntity {
			return &domain.User{}, apperrors.InvalidEntity("user does not exist")
		}
		return &domain.User{}, err
	}

	if user.Topics[title] {
		delete(user.Topics, title)
		err = t.users.Update(t.users.Ctx(), user)
	} else {
		return user, apperrors.InvalidEntity(fmt.Sprintf("topic %s is not among user subscriptions", title))
	}

	if err != nil {
		return user, err
	}

	return user, nil
}

func (t *topicService) SubscribeToTopic(userId string, id string, password string) (*domain.User, *domain.Topic, error) {

	topic := &domain.Topic{}

	err := t.topics.FindById(t.topics.Ctx(), id, topic)

	fmt.Println(topic.ID())

	if err != nil {
		if err == repo.ErrNoMatchingEntity {
			return &domain.User{}, &domain.Topic{}, apperrors.InvalidEntity("topic does not exist")
		}
		return &domain.User{}, &domain.Topic{}, err
	}

	if !(topic.Public || topic.Pswd.Equals(password)) {
		return &domain.User{}, &domain.Topic{}, apperrors.InvalidCredentials("wrong password for topic")
	}

	user := &domain.User{}

	err = t.users.FindById(t.topics.Ctx(), userId, user)

	if err != nil {
		if err == repo.ErrNoMatchingEntity {
			return &domain.User{}, &domain.Topic{}, apperrors.InvalidEntity("subscribing user does not exist")
		}
		return &domain.User{}, &domain.Topic{}, err
	}

	if user.Topics == nil {
		user.Topics = make(map[string]bool)
	}

	if !user.Topics[topic.Title] {
		user.Topics[topic.Title] = true
		err = t.users.Update(t.users.Ctx(), user)
		return user, topic, err
	}

	return user, topic, nil

}

func (t *topicService) CreateTopic(admin string, title string, public bool, password string) (*domain.Topic, error) {
	title = strings.TrimSpace(title)

	topic := &domain.Topic{
		Title:  title,
		Admin:  admin,
		Public: public,
	}

	if !public {
		err := validation.ValidatePassword(password)
		if err != nil {
			return &domain.Topic{}, err
		}

		topic.Pswd = domain.NewPassword(password)
	} else {
		topic.Pswd = domain.NoPassword
	}

	err := validation.ValidateTopic(*topic)

	if err != nil {
		return &domain.Topic{}, err
	}

	otherTopic := &domain.Topic{}

	err = transaction.Do(func(s transaction.Scope) error {
		err = t.topics.FindByTitle(t.topics.Ctx(), title, otherTopic)

		if err == repo.ErrNoMatchingEntity {
			err = t.topics.Add(s.Ctx(), topic)

			if err != nil {
				return err
			}
		}
		if err != nil {
			return err
		}

		if otherTopic.Title == topic.Title {
			return apperrors.DuplicateEntity(fmt.Sprintf("title %s already in use", title))
		}

		user := &domain.User{}

		err = t.users.FindByUsername(s.Ctx(), admin, user)
		user.CreatedTopics[topic.Title] = true
		err = t.users.Update(s.Ctx(), user)
		if err != nil {
			return err
		}

		return s.Commit()
	})

	return topic, err
}

func NewTopicService(topics repo.TopicRepository, users repo.UserRepository) TopicService {
	return &topicService{
		topics: topics,
		users:  users,
	}
}
