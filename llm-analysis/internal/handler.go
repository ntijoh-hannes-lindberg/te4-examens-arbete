package internal

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (a *App) newPromptHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("%s %s ", r.Method, r.URL.Path)

	var prompt Prompt
	if err := json.NewDecoder(r.Body).Decode(&prompt); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if err := a.db.newPrompt(prompt.Text); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	fmt.Println("200 OK")
	w.Header().Set("Content-Type", "text/plain")
	w.Write([]byte(prompt.Text))
}

func (a *App) allPromptsHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("%s %s ", r.Method, r.URL.Path)

	prompts, err := a.db.allPrompts()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	fmt.Println("200 OK")
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(prompts); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func (a *App) deletePromptHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("%s %s ", r.Method, r.URL.Path)

	promptIDStr := chi.URLParam(r, "id")
	var promptID int8
	_, err := fmt.Sscanf(promptIDStr, "%d", &promptID)
	if err != nil {
		http.Error(w, "Invalid prompt ID", http.StatusBadRequest)
		return
	}

	fmt.Printf("attempting to delete prompt id=%d\n", promptID) // <-- add

	if err := a.db.deletePrompt(promptID); err != nil {
		fmt.Printf("deletePrompt error: %v\n", err) // <-- add
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	fmt.Println("200 OK")
	w.WriteHeader(http.StatusOK)
}
