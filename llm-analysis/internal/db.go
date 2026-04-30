package internal

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type DB struct {
	conn *pgxpool.Pool
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
	ID   int64  `json:"id"`
	Text string `json:"text"`
}

type Property struct {
	ID   int64  `json:"id"`
	Name string `json:"tag"`
}

type ChatProperty struct {
	ID         int64 `json:"id"`
	PromptID   int64 `json:"promptId"`
	PropertyID int64 `json:"propertyId"`
}

type Message struct {
	ID           int64  `json:"id"`
	SystemPrompt string `json:"systemPrompt"`
	UserPrompt   string `json:"userPrompt"`
}

// Creating new DB handler
func NewDB() *DB {
	godotenv.Load()

	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	return &DB{
		conn: pool,
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

func (db *DB) newPrompt(text string, Type PromptType, Title string) (int64, error) {
	var id int64
	err := db.conn.QueryRow(
		context.Background(),
		"INSERT INTO prompts (text, type, title) VALUES ($1, $2, $3) RETURNING id",
		text, Type, Title,
	).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("inserting prompt: %w", err)
	}
	return id, nil
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
	_, err := db.conn.Exec(context.Background(), "DELETE FROM prompts_to_properties WHERE prompt_id = $1", id)
	if err != nil {
		return fmt.Errorf("deleting property connection: %w", err)
	}
	_, err = db.conn.Exec(context.Background(), "DELETE FROM prompts WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("deleting prompt: %w", err)
	}
	return nil
}

// Output methods

func (db *DB) getAllOutputs() ([]Output, error) {
	rows, err := db.conn.Query(context.Background(), "SELECT id, text FROM outputs")
	if err != nil {
		return nil, fmt.Errorf("querying outputs: %w", err)
	}
	defer rows.Close()

	outputs := []Output{}
	for rows.Next() {
		var o Output
		if err := rows.Scan(&o.ID, &o.Text); err != nil {
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

func (db *DB) newOutput(text string) error {
	_, err := db.conn.Exec(context.Background(), "INSERT INTO outputs (text) VALUES ($1)", text)
	if err != nil {
		return fmt.Errorf("inserting output: %w", err)
	}
	return nil
}

func (db *DB) getAllProperties() ([]Property, error) {
	rows, err := db.conn.Query(context.Background(), "SELECT * FROM properties")
	if err != nil {
		return nil, fmt.Errorf("querying properties: %w", err)
	}
	defer rows.Close()

	properties := []Property{}
	for rows.Next() {
		var p Property
		if err := rows.Scan(&p.ID, &p.Name); err != nil {
			return nil, fmt.Errorf("scanning property: %w", err)
		}
		properties = append(properties, p)
	}

	return properties, nil
}

func (db *DB) addPropertiesToPrompt(promptID int64, propertyIDs []int64) error {

	for _, propertyID := range propertyIDs {
		_, err := db.conn.Exec(
			context.Background(),
			"INSERT INTO prompts_to_properties (prompt_id, property_id) VALUES ($1, $2)",
			promptID, propertyID,
		)
		if err != nil {
			return fmt.Errorf("associating property with prompt: %w", err)
		}
	}
	return nil
}

func (db *DB) getPropertiesForPrompt(promptID int64) ([]Property, error) {
	rows, err := db.conn.Query(
		context.Background(),
		`SELECT p.id, p.tag FROM properties p
		 JOIN prompts_to_properties pp ON pp.property_id = p.id
		 WHERE pp.prompt_id = $1`,
		promptID,
	)
	if err != nil {
		return nil, fmt.Errorf("querying properties for prompt: %w", err)
	}
	defer rows.Close()

	properties := []Property{}
	for rows.Next() {
		var p Property
		if err := rows.Scan(&p.ID, &p.Name); err != nil {
			return nil, fmt.Errorf("scanning property: %w", err)
		}
		properties = append(properties, p)
	}
	return properties, nil
}
