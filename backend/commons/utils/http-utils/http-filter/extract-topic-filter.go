package httpfilter

import (
	"commons/domain/filter"
	"net/http"
)

func ExtractTopicFilter(r *http.Request) *filter.TopicFilter {

	f := &filter.TopicFilter{
		Title: filter.DefaultTitleFilter,
		Admin: filter.DefaultAdminFilter,
	}

	query := r.URL.Query()

	if query.Has(filter.TitleFilerKey) {
		f.Title = query.Get(filter.TitleFilerKey)
	}

	if query.Has(filter.AdminFilterKey) {
		f.Title = query.Get(filter.AdminFilterKey)
	}

	return f
}
