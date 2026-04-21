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
	ID   int8   `json:"id"`
	Text string `json:"text"`
}

func NewDB() *DB {
	godotenv.Load()

	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
	}

	return &DB{
		conn: conn,
	}
}

func (db *DB) allPrompts() ([]Prompt, error) {
	rows, err := db.conn.Query(context.Background(), "SELECT * FROM prompts")
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		return nil, fmt.Errorf("getting all prompts: %w\n", err)
	}
	defer rows.Close()

	var prompts []Prompt
	for rows.Next() {
		var p Prompt
		if err := rows.Scan(&p.ID, &p.Text); err != nil {
			return nil, fmt.Errorf("scan failed: %w", err)
		}
		prompts = append(prompts, p)
	}

	return prompts, nil
}

func (db *DB) newPrompt(text string) error {
	_, err := db.conn.Exec(context.Background(), "INSERT INTO prompts (text) VALUES ($1);", text)
	if err != nil {
		return fmt.Errorf("Posting prompt: %w", err)
	}
	return nil
}
