package models

import (
	"context"
	"github.com/mark3labs/mcp-go/mcp"
)

type Tool struct {
	Definition mcp.Tool
	Handler    func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error)
}

// Quote represents the Quote schema from the OpenAPI specification
type Quote struct {
	Tags []string `json:"tags,omitempty"` // Array of tags/categories.
	Author string `json:"author,omitempty"` // Author name of quote.
	Quote string `json:"quote"` // The Quote.
	Id string `json:"id"` // Unique identifier representing a specific quote in theysaidso.com.
	Image string `json:"image,omitempty"` // Image URL that can be used for background to display this quote.
	Length int `json:"length,omitempty"` // Length of the quote string.
}

// QuoteResponse represents the QuoteResponse schema from the OpenAPI specification
type QuoteResponse struct {
	Contents interface{} `json:"contents,omitempty"`
	Success string `json:"success,omitempty"` // Metadata about this successful call
}

// SuccessResponse represents the SuccessResponse schema from the OpenAPI specification
type SuccessResponse struct {
	Contents []interface{} `json:"contents,omitempty"` // Contents relevant to this successful call
	Success string `json:"success,omitempty"` // Metadata about this successful call
}

// NewQuote represents the NewQuote schema from the OpenAPI specification
type NewQuote struct {
	Tags []string `json:"tags,omitempty"` // Array of tags/categories.
	Author string `json:"author,omitempty"` // Author name of quote.
	Quote string `json:"quote"` // The Quote.
}

// QOD represents the QOD schema from the OpenAPI specification
type QOD struct {
	Tags []string `json:"tags,omitempty"` // Array of tags/categories.
	Author string `json:"author,omitempty"` // Author name of quote.
	Quote string `json:"quote"` // The Quote.
	Length int `json:"length,omitempty"` // Length of the quote string.
	Id string `json:"id"` // Unique identifier representing a specific quote in theysaidso.com.
	Image string `json:"image,omitempty"` // Image URL that can be used for background to display this quote.
	Date string `json:"date"` // Date this quote of the day belongs to
	Title string `json:"title,omitempty"` // Title of the QOD category
}

// QODResponse represents the QODResponse schema from the OpenAPI specification
type QODResponse struct {
	Success string `json:"success,omitempty"` // Metadata about this successful call
	Contents interface{} `json:"contents,omitempty"`
}
