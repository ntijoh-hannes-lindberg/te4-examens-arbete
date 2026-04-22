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
type Output struct {
	ID   int8   `json:"id"`
	Text string `json:"text"`
}

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

func (db *DB) allPrompts() ([]Prompt, error) {
	rows, err := db.conn.Query(context.Background(), "SELECT * FROM prompts")
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		return nil, fmt.Errorf("getting all prompts: %w\n", err)
	}
	defer rows.Close()

	prompts := []Prompt{}
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
		return fmt.Errorf("posting prompt: %w", err)
	}

	return nil
}

func (db *DB) newOutput(text string) error {
	_, err := db.conn.Exec(context.Background(), "INSERT INTO outputs (text) VALUES ($1);", text)
	if err != nil {
		return fmt.Errorf("posting output: %w", err)
	}
	return nil
}

func (db *DB) deletePrompt(id int8) error {
	var err error
	_, err = db.conn.Exec(context.Background(), "DELETE FROM prompts WHERE id = $1;", id)
	if err != nil {
		return fmt.Errorf("deleting prompt: %w", err)
	}

	return nil
}

func (db *DB) allOutputs() ([]Output, error) {
	rows, err := db.conn.Query(context.Background(), "SELECT id, text FROM outputs")
	if err != nil {
		return nil, fmt.Errorf("getting all outputs: %w", err)
	}
	defer rows.Close()

	outputs := []Output{}
	for rows.Next() {
		var o Output
		if err := rows.Scan(&o.ID, &o.Text); err != nil {
			return nil, fmt.Errorf("scan failed: %w", err)
		}
		outputs = append(outputs, o)
	}
	return outputs, nil
}

func (db *DB) deleteOutput(id int8) error {
	var err error
	_, err = db.conn.Exec(context.Background(), "DELETE FROM outputs WHERE id = $1;", id)
	if err != nil {
		return fmt.Errorf("deleting output: %w", err)
	}

	return nil
}
