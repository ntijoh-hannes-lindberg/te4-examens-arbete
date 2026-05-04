package internal

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

type DB struct {
	conn *pgx.Conn
}

type Prompt struct {
	ID    int64      `json:"id"`
	Text  string     `json:"text"`
	Type  PromptType `json:"type"`
	Title string     `json:"title"`
}
type PromptType string

const (
	SystemPrompt PromptType = "system"
	UserPrompt   PromptType = "user"
)

type Output struct {
	ID             int64  `json:"id"`
	Text           string `json:"text"`
	SystemPromptID *int64 `json:"system_prompt_id"`
	UserPromptID   *int64 `json:"user_prompt_id"`
}

type Property struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type Chat struct {
	ID           int64 `json:"id"`
	SystemPrompt string
	UserPrompt   string
	Outputs      string
}

type Message struct {
	ID             int64  `json:"Id"`
	SystemPromptID int64  `json:"systemPromptId"`
	UserPromptID   int64  `json:"UserPromptId"`
	SystemPrompt   string `json:"systemPrompt"`
	UserPrompt     string `json:"userPrompt"`
}

// Creating new DB handler
func NewDB() *DB {
	godotenv.Load()

	config, err := pgx.ParseConfig(os.Getenv("DATABASE_URL"))
	if err != nil {
		os.Exit(1)
	}
	config.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol
	conn, err := pgx.ConnectConfig(context.Background(), config)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	return &DB{
		conn: conn,
	}
}

// Prompt methods

func (db *DB) getAllPrompts() ([]Prompt, error) {
	rows, err := db.conn.Query(context.Background(), "SELECT id, text, type, title FROM prompts")
	if err != nil {
		return nil, fmt.Errorf("querying prompts: %w", err)
	}
	defer rows.Close()

	prompts := []Prompt{}
	for rows.Next() {
		var p Prompt
		if err := rows.Scan(&p.ID, &p.Text, &p.Type, &p.Title); err != nil {
			return nil, fmt.Errorf("scanning prompt: %w", err)
		}
		prompts = append(prompts, p)
	}

	return prompts, nil
}

func (db *DB) newPrompt(text string, Type PromptType, Title string) error {
	_, err := db.conn.Exec(context.Background(), "INSERT INTO prompts (text, type, title) VALUES ($1, $2, $3)", text, Type, Title)
	if err != nil {
		return fmt.Errorf("inserting prompt: %w", err)
	}
	return nil
}

func (db *DB) getPrompt(id int64) (Prompt, error) {
	var prompt Prompt
	err := db.conn.QueryRow(context.Background(), "SELECT id, text, type, title FROM prompts WHERE id=$1", id).
		Scan(&prompt.ID, &prompt.Text, &prompt.Type, &prompt.Title)
	if err != nil {
		return Prompt{}, fmt.Errorf("selecting prompt: %w", err)
	}

	return prompt, nil
}

// Update prompt
func (db *DB) updatePrompt(prompt Prompt) error {
	_, err := db.conn.Exec(context.Background(), "UPDATE prompts SET text = $1, title = $2, type = $3 WHERE id = $4", prompt.Text, prompt.Title, prompt.Type, prompt.ID)
	if err != nil {
		return fmt.Errorf("updating prompt: %w", err)
	}

	return nil
}

func (db *DB) deletePrompt(id int64) error {
	_, err := db.conn.Exec(context.Background(), "DELETE FROM prompts WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("deleting prompt: %w", err)
	}
	return nil
}

// Output methods

func (db *DB) getAllOutputs() ([]Output, error) {
	rows, err := db.conn.Query(context.Background(), "SELECT id, text, system_prompt_id, user_prompt_id FROM outputs")
	if err != nil {
		return nil, fmt.Errorf("querying outputs: %w", err)
	}
	defer rows.Close()

	outputs := []Output{}
	for rows.Next() {
		var o Output
		if err := rows.Scan(&o.ID, &o.Text, &o.SystemPromptID, &o.UserPromptID); err != nil {
			return nil, fmt.Errorf("scanning output: %w", err)
		}
		outputs = append(outputs, o)
	}

	return outputs, nil
}

func (db *DB) deleteOutput(id int64) error {
	_, err := db.conn.Exec(context.Background(), "DELETE FROM outputs WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("deleting output: %w", err)
	}
	return nil
}

func (db *DB) newOutput(text string, systemPromptID int64, userPromptID int64) error {
	_, err := db.conn.Exec(context.Background(), "INSERT INTO outputs (text, system_prompt_id, user_prompt_id) VALUES ($1, $2, $3)", text, systemPromptID, userPromptID)
	if err != nil {
		return fmt.Errorf("inserting output: %v", err)
	}
	return nil
}
