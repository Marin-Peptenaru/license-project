package httpfilter

import (
	"commons/domain/filter"
	"net/http"
	"strconv"
	"time"
)

func ExtractMessageFilter(r *http.Request) *filter.MessageFilter {
	f := &filter.MessageFilter{
		To:    "",
		After: time.Now().Unix(),
	}

	query := r.URL.Query()

	if query.Has(filter.TopicFilterKey) {
		f.To = query.Get(filter.TopicFilterKey)
	}

	if query.Has(filter.AfterFilterKey) {
		after, err := strconv.Atoi(query.Get(filter.AfterFilterKey))

		if err != nil {
			f.After = time.Now().Unix()
		} else {
			f.After = int64(after)
		}
	}

	return f
}
