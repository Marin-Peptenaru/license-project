package httpfilter

import (
	"commons/domain/filter"
	"net/http"
)

func ExtractUserFilter(r *http.Request) *filter.UserFilter {
	f := &filter.UserFilter{
		Username: filter.DefaultUsernameFilter,
	}

	query := r.URL.Query()

	if query.Has(filter.UsernameFilterKey) {
		f.Username = query.Get(filter.UsernameFilterKey)
	}

	return f
}
