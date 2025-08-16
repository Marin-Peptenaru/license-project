package httpfilter

import (
	"commons/domain/filter"
	"net/http"
	"strconv"
)

func ExtractMessageFilter(r *http.Request) *filter.MessageFilter {
	f := &filter.MessageFilter{
		To:    "",
		After: 0,
	}

	query := r.URL.Query()

	if query.Has(filter.TopicFilterKey) {
		f.To = query.Get(filter.TopicFilterKey)
	}

	if query.Has(filter.AfterFilterKey) {
		after, err := strconv.Atoi(query.Get(filter.AfterFilterKey))

		if err != nil {
			f.After = 0
		} else {
			f.After = int64(after)
		}
	}

	return f
}
