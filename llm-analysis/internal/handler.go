package internal

import (
	"encoding/json"
	"fmt"
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

	err = a.db.newPrompt(prompt.Text, prompt.Type, prompt.Title)
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

func (a *App) getPromptHandler(w http.ResponseWriter, r *http.Request) {
	urlId := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(urlId, 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("Could'nt parse prompt id: %v", err), http.StatusBadRequest)
	}

	prompt, err := a.db.getPrompt(id)
	if err != nil {
		fmt.Println(err)
		http.Error(w, fmt.Sprintf("Sending request to data base: %v", err), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prompt)
}

func (a *App) deleteOutputHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	idNum, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	err = a.db.deleteOutput(idNum)
	if err != nil {
		http.Error(w, "Failed to delete output", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (a *App) deletePromptHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	idNum, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		http.Error(w, "Invalid id", http.StatusBadRequest)
		return
	}

	err = a.db.deletePrompt(idNum)
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

func (a *App) newOutputHandler(w http.ResponseWriter, r *http.Request) {
	var message Message
	err := json.NewDecoder(r.Body).Decode(&message)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	response, err := a.aiProvider.CallLLM(message.UserPrompt, message.SystemPrompt)
	if err != nil {
		http.Error(w, "Failed to call AI provider", http.StatusInternalServerError)
		return
	}
	err = a.db.newOutput(response)
	if err != nil {
		http.Error(w, "Failed to insert output", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
