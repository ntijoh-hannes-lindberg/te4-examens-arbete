package internal

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (a *App) newPromptHandler(w http.ResponseWriter, r *http.Request) {

	var prompt Prompt
	err := json.NewDecoder(r.Body).Decode(&prompt)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = a.db.newPrompt(prompt.Text, prompt.Type)
	if err != nil {
		http.Error(w, "Failed to insert prompt", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (a *App) allPromptsHandler(w http.ResponseWriter, r *http.Request) {
	prompts, err := a.db.getAllPrompts()
	if err != nil {
		http.Error(w, "Failed to fetch prompts", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prompts)
}

func (a *App) deleteOutputHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	idNum, err := strconv.ParseInt(id, 10, 8)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	err = a.db.deleteOutput(int8(idNum))
	if err != nil {
		http.Error(w, "Failed to delete output", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (a *App) deletePromptHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	idNum, err := strconv.ParseInt(id, 10, 8)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	err = a.db.deletePrompt(int8(idNum))
	if err != nil {
		http.Error(w, "Failed to delete prompt", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (a *App) allOutputsHandler(w http.ResponseWriter, r *http.Request) {
	outputs, err := a.db.getAllOutputs()
	if err != nil {
		http.Error(w, "Failed to fetch outputs", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(outputs)
}
