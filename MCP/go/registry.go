package main

import (
	"github.com/they-said-so-quotes-api/mcp-server/config"
	"github.com/they-said-so-quotes-api/mcp-server/models"
	tools_qshow "github.com/they-said-so-quotes-api/mcp-server/tools/qshow"
	tools_quote "github.com/they-said-so-quotes-api/mcp-server/tools/quote"
	tools_quote_images "github.com/they-said-so-quotes-api/mcp-server/tools/quote_images"
	tools_private_quotes "github.com/they-said-so-quotes-api/mcp-server/tools/private_quotes"
	tools_quote_of_the_day "github.com/they-said-so-quotes-api/mcp-server/tools/quote_of_the_day"
	tools_private_qod "github.com/they-said-so-quotes-api/mcp-server/tools/private_qod"
)

func GetAll(cfg *config.APIConfig) []models.Tool {
	return []models.Tool{
		tools_qshow.CreateGet_qshow_listTool(cfg),
		tools_quote.CreateGet_quote_categories_popularTool(cfg),
		tools_quote_images.CreateGet_quote_image_font_listTool(cfg),
		tools_private_quotes.CreatePost_quote_tags_addTool(cfg),
		tools_quote_of_the_day.CreateGet_qod_languagesTool(cfg),
		tools_quote_images.CreateGet_quote_image_searchTool(cfg),
		tools_quote.CreateGet_quote_authors_searchTool(cfg),
		tools_private_quotes.CreateGet_quote_listTool(cfg),
		tools_quote_images.CreatePost_quote_image_background_tags_removeTool(cfg),
		tools_qshow.CreateGet_qshow_quotesTool(cfg),
		tools_qshow.CreatePost_qshow_quotes_addTool(cfg),
		tools_quote_images.CreatePost_quote_image_font_tags_removeTool(cfg),
		tools_quote.CreateGet_quote_authors_popularTool(cfg),
		tools_qshow.CreatePost_qshow_quotes_removeTool(cfg),
		tools_quote_of_the_day.CreateGet_qod_categoriesTool(cfg),
		tools_quote_images.CreatePost_quote_image_background_tags_addTool(cfg),
		tools_quote_images.CreateGet_quote_imageTool(cfg),
		tools_quote_images.CreatePut_quote_imageTool(cfg),
		tools_quote_images.CreateGet_quote_image_background_searchTool(cfg),
		tools_quote_images.CreateGet_quote_image_background_listTool(cfg),
		tools_private_quotes.CreatePost_quote_tags_removeTool(cfg),
		tools_quote.CreateGet_quote_bookmark_toggleTool(cfg),
		tools_quote.CreateGet_quote_like_toggleTool(cfg),
		tools_private_qod.CreatePut_qodTool(cfg),
		tools_quote_of_the_day.CreateGet_qodTool(cfg),
		tools_private_qod.CreatePatch_qodTool(cfg),
		tools_quote.CreateGet_quote_categories_searchTool(cfg),
		tools_quote_images.CreatePost_quote_image_font_tags_addTool(cfg),
		tools_quote.CreateGet_quote_searchTool(cfg),
		tools_quote_images.CreateGet_quote_image_font_searchTool(cfg),
		tools_quote.CreateGet_quoteTool(cfg),
		tools_private_quotes.CreatePatch_quoteTool(cfg),
		tools_private_quotes.CreatePost_quoteTool(cfg),
		tools_private_quotes.CreatePut_quoteTool(cfg),
		tools_qshow.CreateGet_qshowTool(cfg),
		tools_qshow.CreatePatch_qshowTool(cfg),
		tools_qshow.CreatePut_qshowTool(cfg),
		tools_quote.CreateGet_quote_randomTool(cfg),
	}
}
