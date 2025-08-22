/**
 * Create a private `Quote of the Day` service.
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

export async function put_qod(authors, title, language, repeat_after, private, sfw) {
  try {
    const config = getConfig();
    const requestBody = {
      authors,
      title,
      language,
      repeat_after,
      private,
      sfw
    };
    
    const url = `${config.baseURL}/api/unknown`;
    
    const response = await fetch(url, {
      method: 'PUT',
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

export function createPutQodTool() {
  return {
    definition: {
      name: 'put-qod',
      description: 'Create a private `Quote of the Day` service.',
      inputSchema: {
        type: 'object',
        properties: {
          authors: {
            type: 'string',
            description: 'Comma seperated author names. Quotes will be chosen from one of these authors.'
          },
          title: {
            type: 'string',
            description: 'Title of the Quote of the day category'
          },
          language: {
            type: 'string',
            description: 'Quotes language.'
          },
          repeat_after: {
            type: 'number',
            description: 'How many days after the quotes can repeat? If you are setting this up from your private collection make sure you have more quotes that meet the filter conditions than the days you specify here.'
          },
          private: {
            type: 'boolean',
            description: 'Should apply the filters to the private collection. Default is public quotes in the platform.'
          },
          sfw: {
            type: 'boolean',
            description: 'Consider only quotes marked as "sfw" (Safe for work).'
          }
        },
        required: ["title"]
      }
    },
    handler: put_qod
  };
}