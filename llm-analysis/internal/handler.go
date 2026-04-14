package internal

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Prompt struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

func (a *App) newPrompt(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("%s %s ", r.Method, r.URL.Path)

	var prompt Prompt
	if err := json.NewDecoder(r.Body).Decode(&prompt); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	fmt.Println("200 OK")
	w.Header().Set("Content-Type", "text/plain")
	w.Write([]byte(prompt.Text))
}
