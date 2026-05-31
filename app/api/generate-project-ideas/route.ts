import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  branch: string;
  difficulty: string;
  keywords: string;
  budget: string;
  count: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    // ============================================
    // READY FOR REAL GEMINI - Just uncomment below
    // ============================================
    /*
    import { GoogleGenerativeAI } from "@google/generative-ai";
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an experienced Anna University project guide who has mentored 500+ students from Tamil Nadu colleges.

Generate ${body.count} practical, low-to-medium cost engineering project ideas for a ${body.branch} student.
Difficulty level: ${body.difficulty}
Student interests/keywords: ${body.keywords || "general"}
Budget range: ${body.budget}

Requirements:
- Focus on real problems in Tamil Nadu (agriculture, textile, EV, power cuts, rural connectivity, traffic, healthcare access)
- Use affordable components available in Madurai/Coimbatore/Chennai local shops
- Include both hardware + software where possible
- Make it suitable for Anna University final year / mini project
- Return ONLY valid JSON array with this exact structure:
[{
  "title": "...",
  "description": "...",
  "techStack": ["ESP32", "Flutter"],
  "estimatedCost": "₹2,400 – ₹3,200",
  "difficulty": "${body.difficulty}",
  "whyGood": "Why this is good for Anna University students",
  "components": ["ESP32", "Sensors"]
}]

Respond ONLY with the JSON array. No extra text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean and parse JSON
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const ideas = JSON.parse(cleanJson);

    return NextResponse.json({ ideas });
    */

    // ============================================
    // CURRENT: High-quality mock responses
    // ============================================
    const keywords = body.keywords || "IoT";
    const ideas = [
      {
        title: `Smart ${keywords} Monitoring System using ESP32 for Rural Tamil Nadu`,
        description: `A complete ${body.branch} project that monitors environmental conditions (temperature, humidity, soil, air quality) and works reliably during power cuts and poor internet. Includes local OLED display + GSM fallback alerts.`,
        techStack: ["ESP32", "GSM", "Sensors"],
        estimatedCost: body.budget === "Low" ? "₹2,100 – ₹2,900" : "₹3,300 – ₹4,600",
        difficulty: body.difficulty,
        whyGood: "High practical value in Tamil Nadu villages. Excellent for Anna University final year project and placement interviews.",
        components: ["ESP32 DevKit", "DHT22", "Soil Sensor", "SIM800L", "OLED Display"],
      },
      {
        title: `AI-Powered ${keywords} Prediction & Alert System`,
        description: `Lightweight machine learning model running on edge device (ESP32 or Raspberry Pi) to predict failures or optimize processes. Designed for small industries and farms in Coimbatore and Tirupur regions.`,
        techStack: ["Python", "TensorFlow Lite", "ESP32"],
        estimatedCost: "₹2,800 – ₹4,200",
        difficulty: body.difficulty === "Beginner" ? "Intermediate" : body.difficulty,
        whyGood: "Combines AI + Embedded. Very strong for campus placements and higher studies. Good scope for research paper.",
        components: ["Raspberry Pi 4 / ESP32-S3", "Camera Module", "Sensors", "MicroSD Card"],
      },
      {
        title: `Low-Cost ${keywords} Safety & Automation System with GSM Alerts`,
        description: `Built specifically for small factories, poultry farms, and rural homes in Tamil Nadu. Uses GSM for reliable SMS alerts even when internet is down. Very low maintenance and cost-effective.`,
        techStack: ["ESP32", "GSM Module", "Sensors"],
        estimatedCost: body.budget === "Low" ? "₹1,950 – ₹2,700" : "₹3,100 – ₹4,000",
        difficulty: body.difficulty,
        whyGood: "High social impact + strong technical depth. Popular in project exhibitions and can attract funding.",
        components: ["ESP32", "SIM800L / A6 GSM", "Multiple Sensors", "Relay Module", "Buzzer"],
      },
    ];

    return NextResponse.json({ ideas: ideas.slice(0, body.count) });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate ideas" }, 
      { status: 500 }
    );
  }
}
