package filter

const (
	DefaultAdminFilter = ".*"
	DefaultTitleFilter = ".*"
)

const (
	AdminFilterKey = "admin"
	TitleFilerKey  = "title"
)

type TopicFilter struct {
	Admin string
	Title string
}
