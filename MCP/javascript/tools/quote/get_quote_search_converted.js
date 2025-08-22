/**
 * Search for a `Quote` in They Said So platform. Optional `category` , `author`, `minlength`, `maxlength` params determines the filters applied while searching for the quote.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

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

export async function get_quote_search(category, author, query, language, minlength, maxlength, limit, private, sfw) {
  try {
    const config = getConfig();
    const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (author) params.append("author", author);
      if (query) params.append("query", query);
      if (language) params.append("language", language);
      if (minlength) params.append("minlength", minlength);
      if (maxlength) params.append("maxlength", maxlength);
      if (limit) params.append("limit", limit);
      if (private) params.append("private", private);
      if (sfw) params.append("sfw", sfw);
    const queryString = params.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;
    
    const url = `${config.baseURL}/api/unknown`;
    
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.bearerToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return `Failed to format JSON: ${response.status} ${response.statusText}`;
    }
    
    try {
      const result = await response.json();
      return JSON.stringify(result, null, 2);
    } catch (e) {
      return await response.text();
    }
    
  } catch (error) {
    return `Request failed: ${error.message}`;
  }
}

export function createGetQuoteSearchTool() {
  return {
    definition: {
      name: 'get-quote-search',
      description: 'Search for a `Quote` in They Said So platform. Optional `category` , `author`, `minlength`, `maxlength` params determines the filters applied while searching for the quote.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Quote Category'
          },
          author: {
            type: 'string',
            description: 'Quote Author'
          },
          query: {
            type: 'string',
            description: 'keyword to search for in the quote'
          },
          language: {
            type: 'string',
            description: 'Language of the Quote. The language must be supported in our system.'
          },
          minlength: {
            type: 'number',
            description: 'Quote minimum Length'
          },
          maxlength: {
            type: 'number',
            description: 'Quote maximum Length'
          },
          limit: {
            type: 'number',
            description: 'No of quotes to return. The max limit depends on the subscription level.'
          },
          private: {
            type: 'boolean',
            description: 'Should search private collection? Default searches public collection.'
          },
          sfw: {
            type: 'boolean',
            description: 'Should search only SFW (Safe For Work) quotes?'
          }
        },
        required: []
      }
    },
    handler: get_quote_search
  };
}