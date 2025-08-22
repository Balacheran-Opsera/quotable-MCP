/**
 * Get the list of Qshows in They Said So platform.
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

export async function get_qshow_list(start, public) {
  try {
    const config = getConfig();
    const params = new URLSearchParams();
      if (start) params.append("start", start);
      if (public) params.append("public", public);
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

export function createGetQshowListTool() {
  return {
    definition: {
      name: 'get-qshow-list',
      description: 'Get the list of Qshows in They Said So platform.',
      inputSchema: {
        type: 'object',
        properties: {
          start: {
            type: 'number',
            description: 'Response is paged. This parameter controls where response starts the listing at'
          },
          public: {
            type: 'boolean',
            description: 'Should include public qshows or not in the list'
          }
        },
        required: []
      }
    },
    handler: get_qshow_list
  };
}