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

func Put_quote_imageHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["quote_id"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("quote_id=%v", val))
		}
		if val, ok := args["bgimage_id"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("bgimage_id=%v", val))
		}
		if val, ok := args["bg_color"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("bg_color=%v", val))
		}
		if val, ok := args["font_id"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("font_id=%v", val))
		}
		if val, ok := args["text_color"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("text_color=%v", val))
		}
		if val, ok := args["text_size"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("text_size=%v", val))
		}
		if val, ok := args["halign"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("halign=%v", val))
		}
		if val, ok := args["valign"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("valign=%v", val))
		}
		if val, ok := args["width"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("width=%v", val))
		}
		if val, ok := args["height"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("height=%v", val))
		}
		if val, ok := args["branding"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("branding=%v", val))
		}
		if val, ok := args["include_transparent_layer"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("include_transparent_layer=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/quote/image%s", cfg.BaseURL, queryString)
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

func CreatePut_quote_imageTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("put_quote_image",
		mcp.WithDescription("Create a new quote image for a given quote. Choose background colors/images , choose different font styles and generate a beautiful quote image. Did you just had a feeling of being a god or what?!
"),
		mcp.WithString("quote_id", mcp.Required(), mcp.Description("Quote id")),
		mcp.WithString("bgimage_id", mcp.Description("Background Image id ( Will override bgcolor if supplied)")),
		mcp.WithString("bg_color", mcp.Description("Background Color(if background image id is not supplied)")),
		mcp.WithString("font_id", mcp.Description("Font id")),
		mcp.WithString("text_color", mcp.Description("Text Color")),
		mcp.WithString("text_size", mcp.Description("Text/font size")),
		mcp.WithString("halign", mcp.Description("Horizontal text Alignment Value")),
		mcp.WithString("valign", mcp.Description("Vertical text Alignment Value")),
		mcp.WithNumber("width", mcp.Description("Image Width(By default this takes the width of the background image)")),
		mcp.WithNumber("height", mcp.Description("Image Height(By default this takes the height of the background image)")),
		mcp.WithBoolean("branding", mcp.Description("Disable They Said So branding (Only available in certain subscription levels. Ignored in other levels)")),
		mcp.WithBoolean("include_transparent_layer", mcp.Description("Should include a transparent layer between the text and the background image? This helps when the background image is bright and obscures the text.")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Put_quote_imageHandler(cfg),
	}
}
