package httpfilter

import (
	"commons/domain/filter"
	"commons/utils"
	"net/http"

	"go.uber.org/zap"
)

func ExtractTopicFilter(r *http.Request) *filter.TopicFilter {

	f := &filter.TopicFilter{
		Title: filter.DefaultTitleFilter,
		Admin: filter.DefaultAdminFilter,
	}

	query := r.URL.Query()

	if query.Has(filter.TitleFilerKey) {
		f.Title = query.Get(filter.TitleFilerKey)
		utils.Logger.Debug("topic title filter", zap.String("title", f.Title))

	}

	if query.Has(filter.AdminFilterKey) {
		f.Admin = query.Get(filter.AdminFilterKey)
		utils.Logger.Debug("topic admin filter", zap.String("admin", f.Admin))
	}

	return f
}
