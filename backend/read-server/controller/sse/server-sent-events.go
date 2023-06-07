package sse

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func UpgradeToSSEWriter(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")
}

type ServerSentEvent struct {
	data  string
	event string
}

func (e ServerSentEvent) Send(w http.ResponseWriter, flush bool) {
	if len(e.event) != 0 {
		fmt.Fprintf(w, "event: %s\n", e.event)
	}

	fmt.Fprintf(w, "data: %s\n", e.data)

	fmt.Fprint(w, "\n")

	if flush {
		w.(http.Flusher).Flush() // flush the response writer so that the event is not kept in the response buffer
	}
}

func Event(data any, event string) (ServerSentEvent, error) {
	e := ServerSentEvent{}
	e.event = event

	marshalledData, err := json.Marshal(data)

	if err == nil {
		e.data = string(marshalledData)
	}

	return e, err
}
