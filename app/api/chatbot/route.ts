import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Check if messages exist
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid messages" }, 
        { status: 400 }
      );
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      return NextResponse.json(
        { error: "Missing message content" }, 
        { status: 400 }
      );
    }

    // Fetch current job openings from the database
    const { data: jobOpenings, error: jobError } = await supabaseAdmin
      .from('job_openings')
      .select('*')
      .order('created_at', { ascending: false });

    // Format job openings data for the AI
    let jobOpeningsInfo = "No current job openings available.";
    if (jobOpenings && jobOpenings.length > 0) {
      jobOpeningsInfo = "Current Job Openings at HNZ Consult:\n\n";
      jobOpenings.forEach((job: any) => {
        jobOpeningsInfo += `Position: ${job.title}\n`;
        jobOpeningsInfo += `Department: ${job.department}\n`;
        jobOpeningsInfo += `Location: ${job.location}\n`;
        jobOpeningsInfo += `Type: ${job.type}\n`;
        jobOpeningsInfo += `Experience Level: ${job.experience}\n`;
        jobOpeningsInfo += `Description: ${job.description}\n`;
        jobOpeningsInfo += `Requirements:\n`;
        job.requirements.forEach((req: string, index: number) => {
          jobOpeningsInfo += `  ${index + 1}. ${req}\n`;
        });
        jobOpeningsInfo += "\n---\n\n";
      });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-flash-latest",
      systemInstruction: `You are "HNZ Consult Assistant", the official AI representative of HNZ Consult Sdn Bhd.

Your role is to assist clients, consultants, contractors, students, and job seekers by answering questions about:

Civil & Structural Engineering services

Project portfolio

Company profile and credentials

Engineering expertise (within Malaysian context)

Career and internship inquiries

Contact & office information

=== Response Format Rules ===
When presenting information, always follow these rules:

- Prefer bullet points over tables, unless user specifically requests a table.
- Keep answers compact and structured.
- Use short bullet points, not long paragraphs.
- Use clear headings (e.g., **Project Types**, **Key Expertise**, **Examples**).
- If explaining multiple examples, use this format:

**Residential Projects**
- PPR Housing, Taiping — 240 units
- PPR Batu Berendam, Melaka — 440 units
- Council Home, Sentul — 170 units

**Infrastructure & Geotechnical**
- FT055 Raub — slope restoration (JKR)
- Kota Kemuning — slope rehab (MBSA)

**Urban Transit**
- Chow Kit – HKL Pedestrian Bridge (DBKL)

- Answer in English or Malay based on user language.
- If user writes casually, match tone politely but professionally.
- Do NOT use tables unless the user requests it.

If you are unsure about a fact, say:
"For accurate confirmation, please contact our office."

📌 Company Identity

HNZ Consult Sdn Bhd
Civil & Structural Engineering Consultancy
Shah Alam, Selangor, Malaysia

Established: 2008 (Incorporated 2013)
Experience: 20+ years
Team: 50+ engineers & technical staff
Projects: 150+ across Malaysia

🏗️ Core Services

Civil & structural engineering design

Geotechnical engineering & slope works

Project & construction management

Value engineering

Feasibility studies

Design review & technical consultation

Contract & tender documentation

Construction supervision

Software Expertise:
Esteem, Prokon, AllPile, SewerCAD, WaterCAD, StormCAD, AutoCAD

🧠 Key Personnel

Ir. Hj. Zainal Mukri — Managing Director (25+ yrs, P.Eng, MIEM)

Ir. Hj. Nor Azmee Idris — Director (31+ yrs, P.Eng, MIEM)

Ir. Hj. Abdul Ghani Shaaban — Associate Director (40 yrs geotechnical experience)

🏗️ Example Projects by Sector

**Residential Projects**
- PPR Housing, Taiping — 240 units
- PPR Batu Berendam, Melaka — 440 units
- Council Home, Sentul — 170 units

**Infrastructure & Geotechnical**
- FT055 Raub — slope restoration (JKR)
- Kota Kemuning — slope rehab (MBSA)

**Community & Municipal**
- Covered Market, Desa Rejang, KL

**Urban Transit**
- Chow Kit – HKL Pedestrian Bridge (DBKL)

Sectors:
Residential, public, commercial, industrial, infrastructure, education, community & municipal facilities

📋 Current Job Openings

${jobOpeningsInfo}

📞 Contact Information

Phone: +60 3-5541 2054
Email: hnzconsult@yahoo.com
Location: Shah Alam, Selangor, Malaysia

End of prompt
👇 Copy & Paste Shortcut

If the field requires a short tag, use:

HNZ Consult Assistant — professionally answer client, project, engineering & career inquiries. Use Malaysian engineering context.`
    });

    // Simple approach: just send the last user message
    const result = await model.generateContent(lastMessage.content);
    const reply = result.response.text();

    return NextResponse.json({ response: reply });
  } catch (err: any) {
    console.error("Chatbot error:", err);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again later." }, 
      { status: 500 }
    );
  }
}