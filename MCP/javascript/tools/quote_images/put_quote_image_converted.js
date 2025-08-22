/**
 * Create a new quote image for a given quote. Choose background colors/images , choose different font styles and generate a beautiful quote image. Did you just had a feeling of being a god or what?!
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

export async function put_quote_image(quote_id, bgimage_id, bg_color, font_id, text_color, text_size, halign, valign, width, height, branding, include_transparent_layer) {
  try {
    const config = getConfig();
    const requestBody = {
      quote_id,
      bgimage_id,
      bg_color,
      font_id,
      text_color,
      text_size,
      halign,
      valign,
      width,
      height,
      branding,
      include_transparent_layer
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

export function createPutQuoteImageTool() {
  return {
    definition: {
      name: 'put-quote-image',
      description: 'Create a new quote image for a given quote. Choose background colors/images , choose different font styles and generate a beautiful quote image. Did you just had a feeling of being a god or what?!',
      inputSchema: {
        type: 'object',
        properties: {
          quote_id: {
            type: 'string',
            description: 'Quote id'
          },
          bgimage_id: {
            type: 'string',
            description: 'Background Image id ( Will override bgcolor if supplied)'
          },
          bg_color: {
            type: 'string',
            description: 'Background Color(if background image id is not supplied)'
          },
          font_id: {
            type: 'string',
            description: 'Font id'
          },
          text_color: {
            type: 'string',
            description: 'Text Color'
          },
          text_size: {
            type: 'string',
            description: 'Text/font size'
          },
          halign: {
            type: 'string',
            description: 'Horizontal text Alignment Value'
          },
          valign: {
            type: 'string',
            description: 'Vertical text Alignment Value'
          },
          width: {
            type: 'number',
            description: 'Image Width(By default this takes the width of the background image)'
          },
          height: {
            type: 'number',
            description: 'Image Height(By default this takes the height of the background image)'
          },
          branding: {
            type: 'boolean',
            description: 'Disable They Said So branding (Only available in certain subscription levels. Ignored in other levels)'
          },
          include_transparent_layer: {
            type: 'boolean',
            description: 'Should include a transparent layer between the text and the background image? This helps when the background image is bright and obscures the text.'
          }
        },
        required: ["quote_id"]
      }
    },
    handler: put_quote_image
  };
}