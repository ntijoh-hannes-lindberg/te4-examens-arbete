package internal

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

/// Prompt handlers

func (a *App) newPromptHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Text        string  `json:"text"`
		Type        string  `json:"type"`
		Title       string  `json:"title"`
		PropertyIDs []int64 `json:"property_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	promptID, err := a.db.newPrompt(body.Text, PromptType(body.Type), body.Title)
	if err != nil {
		http.Error(w, "Failed to insert prompt", http.StatusInternalServerError)
		return
	}
	if len(body.PropertyIDs) > 0 {
		if err := a.db.addPropertiesToPrompt(promptID, body.PropertyIDs); err != nil {
			http.Error(w, "Failed to associate properties with prompt", http.StatusInternalServerError)
			return
		}
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
		return
	}

	prompt, err := a.db.getPrompt(id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Sending request to data base: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prompt)
}

// Handler to update a prompt
func (a *App) updatePromptHandler(w http.ResponseWriter, r *http.Request) {
	urlId := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(urlId, 10, 64)
	if err != nil {
		http.Error(w, fmt.Sprintf("Parsing prompt id: %v", err), http.StatusBadRequest)
		return
	}
	var updatePrompt UpdatePrompt
	updatePrompt.ID = id
	if err := json.NewDecoder(r.Body).Decode(&updatePrompt); err != nil {
		http.Error(w, fmt.Sprintf("Decoding prompt: %v", err), http.StatusBadRequest)
		return
	}

	if err := a.db.updatePrompt(updatePrompt); err != nil {
		http.Error(w, fmt.Sprintf("Sending to DB client: %v", err), http.StatusBadRequest)
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

/// Output handlers

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

	err = a.db.newOutput(response, message.SystemPromptID, message.UserPromptID)
	if err != nil {
		http.Error(w, "Failed to insert output", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (a *App) allPropertiesHandler(w http.ResponseWriter, r *http.Request) {
	properties, err := a.db.getAllProperties()
	if err != nil {
		http.Error(w, "Failed to fetch properties", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(properties)
}

func (a *App) allPropertiesForPromptHandler(w http.ResponseWriter, r *http.Request) {
	properties, err := a.db.allPropertiesForPrompt()
	if err != nil {
		http.Error(w, "Failed to fetch properties", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(properties)
}
