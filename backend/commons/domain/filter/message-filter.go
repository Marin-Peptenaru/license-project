package filter

const (
	DefaultTopicFilter = ""
	DefaultAfterFilter = 0
)

const (
	TopicFilterKey = "to"
	AfterFilterKey = "after"
)

type MessageFilter struct {
	After int64
	To    string
}
