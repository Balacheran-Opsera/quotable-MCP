/**
 * Gets a list of author names in the system.
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

export async function get_quote_authors_search(query, language, start, limit, detailed) {
  try {
    const config = getConfig();
    const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (language) params.append("language", language);
      if (start) params.append("start", start);
      if (limit) params.append("limit", limit);
      if (detailed) params.append("detailed", detailed);
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

export function createGetQuoteAuthorsSearchTool() {
  return {
    definition: {
      name: 'get-quote-authors-search',
      description: 'Gets a list of author names in the system.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Text string to search for in author names'
          },
          language: {
            type: 'string',
            description: 'Language. A same author may have quotes in two or more different languages. So for example 'Mahatma Gandhi' may be returned for language "en"(English), and "மஹாத்மா காந்தி" may be returned when the language is "ta" (Tamil).'
          },
          start: {
            type: 'number',
            description: 'Response is paged. This parameter controls where response starts the listing at'
          },
          limit: {
            type: 'number',
            description: 'Response is paged. This parameter controls how many is returned in the result. The maximum depends on the subscription level.'
          },
          detailed: {
            type: 'boolean',
            description: 'Should return detailed author information such as `birthday`, `death date`, `occupation`, `description` etc. Only available at certain subscription levels.'
          }
        },
        required: []
      }
    },
    handler: get_quote_authors_search
  };
}