/**
 * Add a new quote to your private collection. Same as 'PUT' but added since some clients don't handle PUT well.
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

export async function post_quote(quote, author, tags, language) {
  try {
    const config = getConfig();
    const requestBody = {
      quote,
      author,
      tags,
      language
    };
    
    const url = `${config.baseURL}/api/unknown`;
    
    const response = await fetch(url, {
      method: 'POST',
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

export function createPostQuoteTool() {
  return {
    definition: {
      name: 'post-quote',
      description: 'Add a new quote to your private collection. Same as 'PUT' but added since some clients don't handle PUT well.',
      inputSchema: {
        type: 'object',
        properties: {
          quote: {
            type: 'string',
            description: 'Quote'
          },
          author: {
            type: 'string',
            description: 'Quote Author'
          },
          tags: {
            type: 'string',
            description: 'Comma Separated tags'
          },
          language: {
            type: 'string',
            description: 'Language. If not supplied an auto detection mechanism will be used to detect a language.'
          }
        },
        required: ["quote"]
      }
    },
    handler: post_quote
  };
}