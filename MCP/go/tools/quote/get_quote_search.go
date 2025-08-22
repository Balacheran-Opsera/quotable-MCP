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

func Get_quote_searchHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["category"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("category=%v", val))
		}
		if val, ok := args["author"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("author=%v", val))
		}
		if val, ok := args["minlength"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("minlength=%v", val))
		}
		if val, ok := args["maxlength"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("maxlength=%v", val))
		}
		if val, ok := args["query"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("query=%v", val))
		}
		if val, ok := args["private"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("private=%v", val))
		}
		if val, ok := args["language"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("language=%v", val))
		}
		if val, ok := args["limit"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("limit=%v", val))
		}
		if val, ok := args["sfw"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("sfw=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/quote/search%s", cfg.BaseURL, queryString)
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
		var result models.QuoteResponse
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

func CreateGet_quote_searchTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_quote_search",
		mcp.WithDescription("Search for a `Quote` in They Said So platform. Optional `category` , `author`, `minlength`, `maxlength` params determines the filters applied while searching for the quote. "),
		mcp.WithString("category", mcp.Description("Quote Category")),
		mcp.WithString("author", mcp.Description("Quote Author")),
		mcp.WithNumber("minlength", mcp.Description("Quote minimum Length")),
		mcp.WithNumber("maxlength", mcp.Description("Quote maximum Length")),
		mcp.WithString("query", mcp.Description("keyword to search for in the quote")),
		mcp.WithBoolean("private", mcp.Description("Should search private collection? Default searches public collection.")),
		mcp.WithString("language", mcp.Description("Language of the Quote. The language must be supported in our system.")),
		mcp.WithNumber("limit", mcp.Description("No of quotes to return. The max limit depends on the subscription level.")),
		mcp.WithBoolean("sfw", mcp.Description("Should search only SFW (Safe For Work) quotes?")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_quote_searchHandler(cfg),
	}
}
