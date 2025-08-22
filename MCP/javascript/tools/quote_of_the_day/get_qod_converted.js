/**
 * Gets `Quote of the Day` (QOD). Optional `category` param determines the category of returned quote of the day
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

export async function get_qod(category, language, id) {
  try {
    const config = getConfig();
    const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (language) params.append("language", language);
      if (id) params.append("id", id);
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

export function createGetQodTool() {
  return {
    definition: {
      name: 'get-qod',
      description: 'Gets `Quote of the Day` (QOD). Optional `category` param determines the category of returned quote of the day',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'QOD Category (Used in public QOD only)'
          },
          language: {
            type: 'string',
            description: 'Language of the QOD. The language must be supported in our QOD system.'
          },
          id: {
            type: 'string',
            description: 'QOD defition id (Used in private QOD only)'
          }
        },
        required: []
      }
    },
    handler: get_qod
  };
}