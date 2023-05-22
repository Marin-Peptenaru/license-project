package httputils

import (
	"commons/dto"
	"net/http"
	"strconv"
)

const defaultPageNumber = 0
const defaultPageSize = 10

func GetPageInfo(r *http.Request) *dto.PageInfo {
	page := &dto.PageInfo{}

	pageNumber, err := strconv.Atoi(r.URL.Query().Get("pageNumber"))

	if err != nil {
		page.PageNumber = defaultPageNumber
	} else {
		page.PageNumber = pageNumber
	}

	pageSize, err := strconv.Atoi(r.URL.Query().Get("pageSize"))

	if err != nil {
		page.PageSize = defaultPageSize
	} else {
		page.PageSize = pageSize
	}

	return page
}
