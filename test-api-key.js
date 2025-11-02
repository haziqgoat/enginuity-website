const https = require('https');

// Load environment variables
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  envLines.forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, data });
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function testApiKey() {
  try {
    console.log('Testing Google AI API key...');
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('ERROR: GOOGLE_AI_API_KEY is not set in environment variables');
      return;
    }
    
    console.log('API Key exists and is properly loaded');
    
    // Test the API key with a simple list models request
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models?key=${process.env.GOOGLE_AI_API_KEY}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    console.log('Making request to list models...');
    const response = await makeRequest(options);
    console.log('Response status:', response.statusCode);
    console.log('Response headers:', response.headers);
    
    if (response.statusCode === 200) {
      console.log('SUCCESS: API key is valid');
      const data = JSON.parse(response.data);
      console.log('Available models:');
      if (data.models) {
        data.models.forEach(model => {
          console.log(`- ${model.name}: ${model.displayName || 'No display name'}`);
        });
      }
    } else {
      console.log('ERROR: API key may be invalid or there was an issue');
      console.log('Response data:', response.data);
    }
  } catch (error) {
    console.error('ERROR: Failed to test API key');
    console.error('Error details:', error.message);
  }
}

testApiKey();