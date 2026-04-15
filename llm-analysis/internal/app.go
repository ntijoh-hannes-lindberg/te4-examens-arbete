package internal

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

type App struct {
	router *chi.Mux
	port   string
	db     *DB
}

func NewApp() (*App, error) {
	db := NewDB()

	a := &App{
		router: chi.NewRouter(),
		port:   "8080",
		db:     db,
	}

	a.router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	a.router.Post("/prompt", a.newPrompt)

	return a, nil
}

func (a *App) Run() error {
	fmt.Printf("Listening on port :%s\n", a.port)
	return http.ListenAndServe(":"+a.port, a.router)
}
