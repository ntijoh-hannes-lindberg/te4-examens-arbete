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

func NewDB() *DB {
	godotenv.Load()

	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	return &DB{
		conn: conn,
	}
}

func (db *DB) newPrompt(text string) error {
	_, err := db.conn.Exec(context.Background(), "INSERT INTO prompts (text) VALUES ($1);", text)
	if err != nil {
		return fmt.Errorf("Posting prompt: %w", err)
	}
	return nil
}
