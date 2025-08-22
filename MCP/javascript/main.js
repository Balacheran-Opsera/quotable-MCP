/**
 * MCP Server - JavaScript Implementation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

import { patch_quote, createPatchQuoteTool } from './tools/private_quotes/patch_quote_converted.js';
import { put_quote, createPutQuoteTool } from './tools/private_quotes/put_quote_converted.js';
import { post_quote_tags_remove, createPostQuoteTagsRemoveTool } from './tools/private_quotes/post_quote_tags_remove_converted.js';
import { post_quote, createPostQuoteTool } from './tools/private_quotes/post_quote_converted.js';
import { get_quote_list, createGetQuoteListTool } from './tools/private_quotes/get_quote_list_converted.js';
import { post_quote_tags_add, createPostQuoteTagsAddTool } from './tools/private_quotes/post_quote_tags_add_converted.js';
import { patch_qod, createPatchQodTool } from './tools/private_qod/patch_qod_converted.js';
import { put_qod, createPutQodTool } from './tools/private_qod/put_qod_converted.js';
import { get_quote_image_font_search, createGetQuoteImageFontSearchTool } from './tools/quote_images/get_quote_image_font_search_converted.js';
import { get_quote_image, createGetQuoteImageTool } from './tools/quote_images/get_quote_image_converted.js';
import { get_quote_image_background_search, createGetQuoteImageBackgroundSearchTool } from './tools/quote_images/get_quote_image_background_search_converted.js';
import { post_quote_image_background_tags_remove, createPostQuoteImageBackgroundTagsRemoveTool } from './tools/quote_images/post_quote_image_background_tags_remove_converted.js';
import { post_quote_image_font_tags_add, createPostQuoteImageFontTagsAddTool } from './tools/quote_images/post_quote_image_font_tags_add_converted.js';
import { get_quote_image_search, createGetQuoteImageSearchTool } from './tools/quote_images/get_quote_image_search_converted.js';
import { get_quote_image_font_list, createGetQuoteImageFontListTool } from './tools/quote_images/get_quote_image_font_list_converted.js';
import { post_quote_image_background_tags_add, createPostQuoteImageBackgroundTagsAddTool } from './tools/quote_images/post_quote_image_background_tags_add_converted.js';
import { put_quote_image, createPutQuoteImageTool } from './tools/quote_images/put_quote_image_converted.js';
import { post_quote_image_font_tags_remove, createPostQuoteImageFontTagsRemoveTool } from './tools/quote_images/post_quote_image_font_tags_remove_converted.js';
import { get_quote_image_background_list, createGetQuoteImageBackgroundListTool } from './tools/quote_images/get_quote_image_background_list_converted.js';
import { post_qshow_quotes_remove, createPostQshowQuotesRemoveTool } from './tools/qshow/post_qshow_quotes_remove_converted.js';
import { get_qshow_quotes, createGetQshowQuotesTool } from './tools/qshow/get_qshow_quotes_converted.js';
import { get_qshow, createGetQshowTool } from './tools/qshow/get_qshow_converted.js';
import { post_qshow_quotes_add, createPostQshowQuotesAddTool } from './tools/qshow/post_qshow_quotes_add_converted.js';
import { get_qshow_list, createGetQshowListTool } from './tools/qshow/get_qshow_list_converted.js';
import { put_qshow, createPutQshowTool } from './tools/qshow/put_qshow_converted.js';
import { patch_qshow, createPatchQshowTool } from './tools/qshow/patch_qshow_converted.js';
import { get_quote_categories_popular, createGetQuoteCategoriesPopularTool } from './tools/quote/get_quote_categories_popular_converted.js';
import { get_quote_authors_popular, createGetQuoteAuthorsPopularTool } from './tools/quote/get_quote_authors_popular_converted.js';
import { get_quote_authors_search, createGetQuoteAuthorsSearchTool } from './tools/quote/get_quote_authors_search_converted.js';
import { get_quote_random, createGetQuoteRandomTool } from './tools/quote/get_quote_random_converted.js';
import { get_quote_categories_search, createGetQuoteCategoriesSearchTool } from './tools/quote/get_quote_categories_search_converted.js';
import { get_quote_like_toggle, createGetQuoteLikeToggleTool } from './tools/quote/get_quote_like_toggle_converted.js';
import { get_quote_bookmark_toggle, createGetQuoteBookmarkToggleTool } from './tools/quote/get_quote_bookmark_toggle_converted.js';
import { get_quote_search, createGetQuoteSearchTool } from './tools/quote/get_quote_search_converted.js';
import { get_quote, createGetQuoteTool } from './tools/quote/get_quote_converted.js';
import { get_qod_categories, createGetQodCategoriesTool } from './tools/quote_of_the_day/get_qod_categories_converted.js';
import { get_qod_languages, createGetQodLanguagesTool } from './tools/quote_of_the_day/get_qod_languages_converted.js';
import { get_qod, createGetQodTool } from './tools/quote_of_the_day/get_qod_converted.js';

// Create MCP server
const server = new Server({
  name: 'MCP Server',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

function getConfig() {
  const baseURL = process.env.API_BASE_URL;
  const bearerToken = process.env.API_BEARER_TOKEN;
  
  if (!baseURL || !bearerToken) {
    const configPath = path.join(os.homedir(), '.api', 'config.json');
    try {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return {
        baseURL: baseURL || configData.baseURL,
        bearerToken: bearerToken || configData.bearerToken
      };
    } catch (e) {
      throw new Error('Configuration not found. Please set API_BASE_URL and API_BEARER_TOKEN environment variables or create config file at ~/.api/config.json');
    }
  }
  
  return { baseURL, bearerToken };
}

// Register all tools
const tools = [
  createPatchQuoteTool(),
  createPutQuoteTool(),
  createPostQuoteTagsRemoveTool(),
  createPostQuoteTool(),
  createGetQuoteListTool(),
  createPostQuoteTagsAddTool(),
  createPatchQodTool(),
  createPutQodTool(),
  createGetQuoteImageFontSearchTool(),
  createGetQuoteImageTool(),
  createGetQuoteImageBackgroundSearchTool(),
  createPostQuoteImageBackgroundTagsRemoveTool(),
  createPostQuoteImageFontTagsAddTool(),
  createGetQuoteImageSearchTool(),
  createGetQuoteImageFontListTool(),
  createPostQuoteImageBackgroundTagsAddTool(),
  createPutQuoteImageTool(),
  createPostQuoteImageFontTagsRemoveTool(),
  createGetQuoteImageBackgroundListTool(),
  createPostQshowQuotesRemoveTool(),
  createGetQshowQuotesTool(),
  createGetQshowTool(),
  createPostQshowQuotesAddTool(),
  createGetQshowListTool(),
  createPutQshowTool(),
  createPatchQshowTool(),
  createGetQuoteCategoriesPopularTool(),
  createGetQuoteAuthorsPopularTool(),
  createGetQuoteAuthorsSearchTool(),
  createGetQuoteRandomTool(),
  createGetQuoteCategoriesSearchTool(),
  createGetQuoteLikeToggleTool(),
  createGetQuoteBookmarkToggleTool(),
  createGetQuoteSearchTool(),
  createGetQuoteTool(),
  createGetQodCategoriesTool(),
  createGetQodLanguagesTool(),
  createGetQodTool()
];

// List all available tools
function listToolsHandler() {
  return { tools: tools.map(tool => tool.definition) };
}

// Handle tool calls
function createCallToolHandler(toolMap) {
  return async (request) => {
    const { name, arguments: args } = request.params;
    
    const tool = toolMap.find(t => t.definition.name === name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }
    
    try {
      const result = await tool.handler(args);
      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      throw new Error(`Tool execution failed: ${error.message}`);
    }
  };
}

// Setup request handlers
server.setRequestHandler(ListToolsRequestSchema, listToolsHandler);
server.setRequestHandler(CallToolRequestSchema, createCallToolHandler(tools));

async function main() {
  try {
    const config = getConfig();
    console.error('MCP Server started successfully');
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}