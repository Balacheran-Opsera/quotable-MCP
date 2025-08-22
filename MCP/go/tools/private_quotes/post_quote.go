package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/they-said-so-quotes-api/mcp-server/config"
	"github.com/they-said-so-quotes-api/mcp-server/models"
	"github.com/mark3labs/mcp-go/mcp"
)

func Post_quoteHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["quote"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("quote=%v", val))
		}
		if val, ok := args["author"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("author=%v", val))
		}
		if val, ok := args["tags"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("tags=%v", val))
		}
		if val, ok := args["language"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("language=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/quote%s", cfg.BaseURL, queryString)
		req, err := http.NewRequest("POST", url, nil)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to create request", err), nil
		}
		// Set authentication based on auth type
		if cfg.BearerToken != "" {
			req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", cfg.BearerToken))
		}
		req.Header.Set("Accept", "application/json")

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Request failed", err), nil
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to read response body", err), nil
		}

		if resp.StatusCode >= 400 {
			return mcp.NewToolResultError(fmt.Sprintf("API error: %s", body)), nil
		}
		// Use properly typed response
		var result map[string]interface{}
		if err := json.Unmarshal(body, &result); err != nil {
			// Fallback to raw text if unmarshaling fails
			return mcp.NewToolResultText(string(body)), nil
		}

		prettyJSON, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to format JSON", err), nil
		}

		return mcp.NewToolResultText(string(prettyJSON)), nil
	}
}

func CreatePost_quoteTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("post_quote",
		mcp.WithDescription("Add a new quote to your private collection. Same as 'PUT' but added since some clients don't handle PUT well."),
		mcp.WithString("quote", mcp.Required(), mcp.Description("Quote")),
		mcp.WithString("author", mcp.Description("Quote Author")),
		mcp.WithString("tags", mcp.Description("Comma Separated tags")),
		mcp.WithString("language", mcp.Description("Language. If not supplied an auto detection mechanism will be used to detect a language.")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Post_quoteHandler(cfg),
	}
}
