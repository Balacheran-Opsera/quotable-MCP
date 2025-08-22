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

func Put_qodHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["repeat_after"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("repeat_after=%v", val))
		}
		if val, ok := args["authors"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("authors=%v", val))
		}
		if val, ok := args["title"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("title=%v", val))
		}
		if val, ok := args["private"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("private=%v", val))
		}
		if val, ok := args["language"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("language=%v", val))
		}
		if val, ok := args["sfw"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("sfw=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/qod%s", cfg.BaseURL, queryString)
		req, err := http.NewRequest("PUT", url, nil)
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
		var result models.SuccessResponse
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

func CreatePut_qodTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("put_qod",
		mcp.WithDescription("Create a private `Quote of the Day` service. 
"),
		mcp.WithNumber("repeat_after", mcp.Description("How many days after the quotes can repeat? If you are setting this up from your private collection make sure you have more quotes that meet the filter conditions than the days you specify here.")),
		mcp.WithString("authors", mcp.Description("Comma seperated author names. Quotes will be chosen from one of these authors.")),
		mcp.WithString("title", mcp.Required(), mcp.Description("Title of the Quote of the day category")),
		mcp.WithBoolean("private", mcp.Description("Should apply the filters to the private collection. Default is public quotes in the platform.")),
		mcp.WithString("language", mcp.Description("Quotes language.")),
		mcp.WithBoolean("sfw", mcp.Description("Consider only quotes marked as \"sfw\" (Safe for work).")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Put_qodHandler(cfg),
	}
}
