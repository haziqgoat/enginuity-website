import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      projectGoal,
      projectSize,
      materialsQuality,
      estimatedDuration,
      projectLocation,
      additionalNotes
    } = body;

    // Validate required fields
    if (!projectGoal || !projectSize || !materialsQuality || !estimatedDuration || !projectLocation) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-flash-latest",
      systemInstruction: `You are an expert cost estimator for civil and structural engineering projects. 
      
Your role is to analyze project details and provide accurate cost estimates with breakdowns.

Instructions:
1. Provide a total estimated cost range (minimum-maximum)
2. Break down costs into categories: Materials, Labor, Overhead, Miscellaneous
3. Give a brief explanation paragraph justifying the estimate
4. Base your estimates on Malaysian market rates for engineering consultancy services
5. Consider the user-friendly project attributes provided (goal, size, materials quality, duration, location)
6. Format your response as JSON with this exact structure:
{
  "totalCostRange": {
    "min": number,
    "max": number,
    "currency": "RM"
  },
  "breakdown": {
    "materials": number,
    "labor": number,
    "overhead": number,
    "miscellaneous": number
  },
  "explanation": "string"
}

Example response:
{
  "totalCostRange": {
    "min": 150000,
    "max": 200000,
    "currency": "RM"
  },
  "breakdown": {
    "materials": 60000,
    "labor": 70000,
    "overhead": 15000,
    "miscellaneous": 5000
  },
  "explanation": "This estimate is based on typical rates for structural design projects of this scale in Malaysia..."
}`
    });

    // Prepare the prompt for the AI with the new simplified fields
    const prompt = `Estimate costs for a project with these user-friendly details:
    
Project Goal: ${projectGoal}
Project Size: ${projectSize}
Preferred Materials Quality: ${materialsQuality}
Estimated Duration: ${estimatedDuration}
Project Location: ${projectLocation}
${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Provide a detailed cost estimate following the format instructions. Consider that these are simplified fields that represent general user needs rather than technical engineering specifications.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from the response
    let jsonResponse;
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonResponse = JSON.parse(jsonMatch[1]);
      } else {
        // Try to parse the entire response as JSON
        jsonResponse = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", responseText);
      // Return a default structure if parsing fails
      jsonResponse = {
        totalCostRange: {
          min: 0,
          max: 0,
          currency: "RM"
        },
        breakdown: {
          materials: 0,
          labor: 0,
          overhead: 0,
          miscellaneous: 0
        },
        explanation: "Unable to generate detailed estimate. Please try again."
      };
    }

    return NextResponse.json(jsonResponse);
  } catch (err: any) {
    console.error("Cost estimator error:", err);
    return NextResponse.json(
      { error: "Failed to generate cost estimate. Please try again later." }, 
      { status: 500 }
    );
  }
}