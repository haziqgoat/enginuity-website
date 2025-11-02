const { GoogleGenerativeAI } = require('@google/generative-ai');
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

async function listModels() {
  try {
    console.log('Listing available Google Gemini models...');
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('ERROR: GOOGLE_AI_API_KEY is not set in environment variables');
      return;
    }
    
    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    
    // List models
    const models = await genAI.listModels();
    console.log('Available models:');
    models.models.forEach(model => {
      console.log(`- ${model.name}: ${model.displayName || 'No display name'}`);
    });
  } catch (error) {
    console.error('ERROR: Failed to list models');
    console.error('Error details:', error.message);
  }
}

listModels();