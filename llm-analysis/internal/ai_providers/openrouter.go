package aiproviders

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
)

type OpenRouterAIProvider struct {
	client openai.Client
	token  string
	model  string
	body   map[string]interface{}
}

func NewOpenRouterAIProvider() (*OpenRouterAIProvider, error) {
	token := os.Getenv("OPENROUTER_API_KEY")
	if token == "" {
		return nil, fmt.Errorf("set env variable key 'OPENROUTER_API_KEY'")
	}

	client := openai.NewClient(
		option.WithBaseURL("https://openrouter.ai/api/v1"),
		option.WithAPIKey(token),
	)

	return &OpenRouterAIProvider{
		client: client,
		token:  token,
		model:  "tencent/hy3-preview:free",
	}, nil
}

func (p *OpenRouterAIProvider) CallLLM(userPrompt string, systemPrompt string) (string, error) {
	response, err := p.client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: p.model,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(systemPrompt),
			openai.UserMessage(userPrompt),
		},
	})
	if err != nil {
		return "", fmt.Errorf("chat completion failed: %w", err)
	}

	return response.Choices[0].Message.Content, nil
}
