// Converted from collaborate.py
// Netlify Function: Handle collaboration submissions
// Saves to netlify/data/collaborations.json

const fs = require('fs');
const path = require('path');

// Map user input regions to the three defined regions
const REGION_MAPPING = {
  eastern: ['eastern', 'east', 'makran', 'gwadar', 'balochistan east', 'coast', 'coastal'],
  western: ['western', 'west', 'kalat', 'zhob', 'balochistan west', 'highland', 'mountain'],
  southern: ['southern', 'south', 'rakhshan', 'desert', 'balochistan south', 'plain']
};

function mapRegionToId(userRegion) {
  /**Map user input region to one of the defined region IDs.*/
  if (!userRegion) {
    return null;
  }
  
  const userRegionLower = userRegion.toLowerCase().trim();
  
  for (const [regionId, keywords] of Object.entries(REGION_MAPPING)) {
    for (const keyword of keywords) {
      if (userRegionLower.includes(keyword)) {
        return regionId;
      }
    }
  }
  
  return null;
}

exports.handler = async (event, context) => {
  // Handle collaboration POST requests
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    // Parse body data
    let data = {};
    
    if (event.body) {
      if (event.body.startsWith('{')) {
        data = JSON.parse(event.body);
      } else {
        // Simple form parser
        const pairs = event.body.split('&');
        for (const pair of pairs) {
          if (pair.includes('=')) {
            const [k, v] = pair.split('=');
            data[k] = decodeURIComponent(v);
          }
        }
      }
    }
    
    const name = (data.name || '').trim();
    const category = (data.category || '').trim();
    const title = (data.title || '').trim();
    const regionInput = (data.region || '').trim();
    const content = (data.content || '').trim();
    
    if (!name || !category || !title || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields required' })
      };
    }
    
    // Map user region input to a defined region ID
    const regionId = mapRegionToId(regionInput);
    
    // Create collaboration entry
    const entry = {
      name,
      category,
      title,
      region: regionInput,
      region_id: regionId,
      content,
      filename: null,
      timestamp: new Date().toISOString().replace('T', ' ').split('.')[0] + ' UTC'
    };
    
    // Save to file
    const dataDir = path.join(__dirname, '../../dist/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const collabFile = path.join(dataDir, 'collaborations.json');
    
    // Load existing collaborations
    let collabs = [];
    if (fs.existsSync(collabFile)) {
      const fileContent = fs.readFileSync(collabFile, 'utf-8');
      collabs = JSON.parse(fileContent);
    }
    
    // Add new collaboration
    collabs.unshift(entry);
    
    // Save updated collaborations
    fs.writeFileSync(collabFile, JSON.stringify(collabs, null, 2), 'utf-8');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Collaboration saved!' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
