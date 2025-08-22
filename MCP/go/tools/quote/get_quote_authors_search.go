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

func Get_quote_authors_searchHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["query"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("query=%v", val))
		}
		if val, ok := args["language"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("language=%v", val))
		}
		if val, ok := args["detailed"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("detailed=%v", val))
		}
		if val, ok := args["start"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("start=%v", val))
		}
		if val, ok := args["limit"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("limit=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/quote/authors/search%s", cfg.BaseURL, queryString)
		req, err := http.NewRequest("GET", url, nil)
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

func CreateGet_quote_authors_searchTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_quote_authors_search",
		mcp.WithDescription("Gets a list of author names in the system. 
"),
		mcp.WithString("query", mcp.Description("Text string to search for in author names")),
		mcp.WithString("language", mcp.Description("Language. A same author may have quotes in two or more different languages. So for example 'Mahatma Gandhi' may be returned for language \"en\"(English), and \"மஹாத்மா காந்தி\" may be returned when the language is \"ta\" (Tamil).")),
		mcp.WithBoolean("detailed", mcp.Description("Should return detailed author information such as `birthday`, `death date`, `occupation`, `description` etc. Only available at certain subscription levels.")),
		mcp.WithNumber("start", mcp.Description("Response is paged. This parameter controls where response starts the listing at")),
		mcp.WithNumber("limit", mcp.Description("Response is paged. This parameter controls how many is returned in the result. The maximum depends on the subscription level.")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_quote_authors_searchHandler(cfg),
	}
}
