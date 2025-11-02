// This is the original OpenAI test script for reference only
// The project has been switched to use Google Gemini AI
// See test-gemini.js for the current test script

const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API connection...');
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('ERROR: OPENAI_API_KEY is not set in environment variables');
      return;
    }
    
    // Test the API with a simple completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say this is a test",
        },
      ],
      max_tokens: 10,
    });
    
    console.log('SUCCESS: OpenAI API is working correctly');
    console.log('Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('ERROR: Failed to connect to OpenAI API');
    console.error('Error details:', error.message);
    
    if (error.status) {
      console.error('Status code:', error.status);
    }
  }
}

testOpenAI();