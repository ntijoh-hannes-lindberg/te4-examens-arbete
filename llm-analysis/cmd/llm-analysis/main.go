package main

import (
	"log"
	"te4-examens-arbete/llm-analysis/internal"
)

func main() {
	a, err := internal.NewApp()
	if err != nil {
		log.Fatalf("Could not create app: %s", err)
	}

	a.Run()
}
