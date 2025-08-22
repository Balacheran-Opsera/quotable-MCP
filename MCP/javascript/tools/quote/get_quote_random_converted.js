/**
 * Gets a `Random Quote`. When you are in a hurry this is what you call to get a random famous quote.
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

export async function get_quote_random(language, limit) {
  try {
    const config = getConfig();
    const params = new URLSearchParams();
      if (language) params.append("language", language);
      if (limit) params.append("limit", limit);
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

export function createGetQuoteRandomTool() {
  return {
    definition: {
      name: 'get-quote-random',
      description: 'Gets a `Random Quote`. When you are in a hurry this is what you call to get a random famous quote.',
      inputSchema: {
        type: 'object',
        properties: {
          language: {
            type: 'string',
            description: 'Language of the Quote. The language must be supported in our system.'
          },
          limit: {
            type: 'number',
            description: 'No of quotes to return. The max limit depends on the subscription level.'
          }
        },
        required: []
      }
    },
    handler: get_quote_random
  };
}