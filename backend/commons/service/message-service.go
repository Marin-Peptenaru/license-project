package service

import (
	"commons/apperrors"
	"commons/domain"
	"commons/domain/filter"
	"commons/dto"
	"commons/repo"
	"commons/repo/transaction"
	"fmt"
	"strings"
	"time"
)

type MessageService interface {
	SaveMessage(senderId string, topic string, content string) (*domain.Message, error)
	FetchMessages(userId string, filter *filter.MessageFilter, page *dto.PageInfo) ([]domain.Message, error)
}

type msgService struct {
	users    repo.UserRepository
	topics   repo.TopicRepository
	messages repo.MessageRepository
}

func (m *msgService) FetchMessages(userId string, filter *filter.MessageFilter, page *dto.PageInfo) ([]domain.Message, error) {

	user := &domain.User{}
	err := m.users.FindById(m.users.Ctx(), userId, user)

	if err != nil {
		return []domain.Message{}, err
	}

	topic := &domain.Topic{}
	err = m.topics.FindByTitle(m.users.Ctx(), filter.To, topic)

	if err != nil {
		return []domain.Message{}, err
	}

	if !user.Topics[filter.To] && user.Username != topic.Admin {
		return []domain.Message{}, apperrors.InvalidCredentials(fmt.Sprintf("user is not subscribed to topicTitle %s", userId))
	}

	msgs := make([]domain.Message, 0)
	err = m.messages.FindByTopicAndAfterTimestamp(m.messages.Ctx(), filter, &msgs, page)

	return msgs, err

}

func (m *msgService) SaveMessage(sender string, topicId string, content string) (*domain.Message, error) {
	var topic *domain.Topic
	var message *domain.Message

	err := transaction.Do(func(s transaction.Scope) error {
		topic = &domain.Topic{}

		err := m.topics.FindById(s.Ctx(), topicId, topic)

		if err != nil {
			if err == repo.ErrNoMatchingEntity {
				return apperrors.InvalidEntity("invalid topic id")
			}
			return err
		}

		if topic.Admin != sender {
			return apperrors.InvalidCredentials("only the admin of a topic can send messages")
		}

		content = strings.TrimSpace(content)

		message = &domain.Message{
			From:      sender,
			To:        topic.Title,
			Content:   content,
			Timestamp: time.Now().Unix(),
		}

		err = m.messages.Add(s.Ctx(), message)
		if err != nil {
			return err
		}

		return s.Commit()
	})

	return message, err
}

func NewMessageService(
	users repo.UserRepository, topics repo.TopicRepository, messages repo.MessageRepository) MessageService {
	return &msgService{
		users:    users,
		topics:   topics,
		messages: messages,
	}
}
