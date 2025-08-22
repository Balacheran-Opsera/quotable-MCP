/**
 * Update a quote
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

export async function patch_quote(id, quote, author, language, tags) {
  try {
    const config = getConfig();
    const requestBody = {
      id,
      quote,
      author,
      language,
      tags
    };
    
    const url = `${config.baseURL}/api/unknown`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${config.bearerToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
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

export function createPatchQuoteTool() {
  return {
    definition: {
      name: 'patch-quote',
      description: 'Update a quote',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Quote ID'
          },
          quote: {
            type: 'string',
            description: 'Quote'
          },
          author: {
            type: 'string',
            description: 'Quote Author'
          },
          language: {
            type: 'string',
            description: 'Language. If not supplied an auto detection mechanism will be used to detect a language.'
          },
          tags: {
            type: 'string',
            description: 'Comma Separated tags'
          }
        },
        required: ["id"]
      }
    },
    handler: patch_quote
  };
}