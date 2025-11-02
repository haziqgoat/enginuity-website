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

async function testGemini() {
  try {
    console.log('Testing Google Gemini API connection...');
    
    console.log('GOOGLE_AI_API_KEY exists:', !!process.env.GOOGLE_AI_API_KEY);
    console.log('GOOGLE_AI_API_KEY length:', process.env.GOOGLE_AI_API_KEY ? process.env.GOOGLE_AI_API_KEY.length : 0);
    console.log('GOOGLE_AI_API_KEY starts with:', process.env.GOOGLE_AI_API_KEY ? process.env.GOOGLE_AI_API_KEY.substring(0, 10) : 'undefined');
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('ERROR: GOOGLE_AI_API_KEY is not set in environment variables');
      return;
    }
    
    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    
    // Try different model names
    const modelNames = [
      "models/gemini-flash-latest",
      "models/gemini-pro-latest",
      "models/gemini-2.0-flash",
      "models/gemini-1.5-pro-latest",
      "models/gemini-1.5-flash-latest",
      "models/gemini-1.0-pro-latest",
      "models/gemini-1.0-pro",
      "models/gemini-pro",
      "gemini-pro",
      "gemini-1.0-pro"
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        // Initialize the model
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Test the API with a simple completion
        const prompt = "Say this is a test";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`SUCCESS: Google Gemini API is working correctly with model ${modelName}`);
        console.log('Response:', text);
        return;
      } catch (modelError) {
        console.log(`Failed with model ${modelName}:`, modelError.message);
      }
    }
    
    throw new Error('All models failed');
  } catch (error) {
    console.error('ERROR: Failed to connect to Google Gemini API');
    console.error('Error details:', error.message);
    
    if (error.status) {
      console.error('Status code:', error.status);
    }
  }
}

testGemini();