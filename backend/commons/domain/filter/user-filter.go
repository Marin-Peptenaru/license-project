package filter

const (
	DefaultUsernameFilter = ".*"
)

const (
	UsernameFilterKey = "username"
)

type UserFilter struct {
	Username string
}
