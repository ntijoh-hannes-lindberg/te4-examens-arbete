package internal

import (
	"fmt"
	"net/http"
	aiproviders "te4-examens-arbete/llm-analysis/internal/ai_providers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

type App struct {
	router     *chi.Mux
	port       string
	db         *DB
	aiProvider AIProvider
}

type AIProvider interface {
	CallLLM(userPrompt string) (string, error)
}

func NewApp() (*App, error) {
	db := NewDB()

	aiProvider, err := aiproviders.NewOpenRouterAIProvider()
	if err != nil {
		return nil, fmt.Errorf("creating AI provider: %w", err)
	}

	a := &App{
		router:     chi.NewRouter(),
		port:       "8080",
		db:         db,
		aiProvider: aiProvider,
	}

	a.router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	a.router.Post("/prompts", a.newPromptHandler)
	a.router.Get("/outputs", a.allOutputsHandler)
	a.router.Get("/prompts", a.allPromptsHandler)
	a.router.Delete("/prompts/delete/{id}", a.deletePromptHandler)
	a.router.Delete("/outputs/delete/{id}", a.deleteOutputHandler)

	return a, nil
}

func (a *App) Run() error {
	fmt.Printf("Listening on port :%s\n", a.port)
	return http.ListenAndServe(":"+a.port, a.router)
}
