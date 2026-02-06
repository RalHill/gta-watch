import { NextRequest, NextResponse } from "next/server";
import type { IncidentCategory } from "@/types";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.warn("OPENROUTER_API_KEY not configured");
}

interface GuidanceRequest {
  category: IncidentCategory;
  description?: string;
  latitude: number;
  longitude: number;
}

const SYSTEM_PROMPT = `You are an emergency guidance assistant for GTA Watch, a community emergency awareness tool in the Greater Toronto Area.

CRITICAL RULES:
- Provide CALM, structured, actionable guidance
- NEVER claim to contact authorities or emergency services
- NEVER ask follow-up questions
- Keep responses under 300 words
- Use clear headings and bullet points
- Always suggest calling 911 if the situation is life-threatening
- Focus on immediate safety actions
- Be supportive but not alarmist

Your role is to help people understand what to do next while emphasizing that this is NOT a replacement for calling 911.`;

export async function POST(request: NextRequest) {
  try {
    const body: GuidanceRequest = await request.json();
    const { category, description, latitude, longitude } = body;

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Construct user prompt
    const userPrompt = `A ${category} incident has been reported in Toronto at coordinates (${latitude}, ${longitude}).
${description ? `Additional context: ${description}` : ""}

Provide immediate, calm guidance on what the reporter should do next. Structure your response with:
1. Immediate Safety Actions (2-3 steps)
2. Important Safety Protocols (if applicable)
3. When to escalate to 911

Keep it concise, clear, and actionable.`;

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gta-watch.local",
        "X-Title": "GTA Watch Emergency Guidance",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      
      // Return fallback guidance
      return NextResponse.json({
        guidance: getFallbackGuidance(category),
      });
    }

    const data = await response.json();
    const guidance = data.choices?.[0]?.message?.content || getFallbackGuidance(category);

    return NextResponse.json({ guidance });
  } catch (error) {
    console.error("Error generating guidance:", error);
    
    // Return generic fallback
    return NextResponse.json({
      guidance: "If this is a life-threatening emergency, call 911 immediately. Stay calm and move to a safe location if possible. Follow official emergency procedures for your area.",
    });
  }
}

/**
 * Fallback guidance if AI is unavailable
 */
function getFallbackGuidance(category: IncidentCategory): string {
  const guidanceMap: Record<IncidentCategory, string> = {
    shooting: `**Immediate Actions:**
- Get to a safe location immediately
- Stay low and avoid windows
- Call 911 if you have not already
- Do not investigate the source

**Safety Protocols:**
- Lock doors and turn off lights
- Silence your phone
- Wait for official all-clear from police

**When to Call 911:** If you hear gunshots or see someone injured, call immediately.`,
    
    medical: `**Immediate Actions:**
- Call 911 if not already done
- Do not move the person unless in immediate danger
- Check if they are breathing and conscious
- If trained, provide first aid

**Safety Protocols:**
- Stay with the person until help arrives
- Keep them warm and comfortable
- Note any important medical information

**When to Call 911:** For any serious injury, chest pain, difficulty breathing, or unconsciousness.`,
    
    fire: `**Immediate Actions:**
- Call 911 immediately if not done
- Evacuate the building using stairs (not elevators)
- Stay low to avoid smoke
- Close doors behind you

**Safety Protocols:**
- Do not re-enter the building
- Move at least 100 feet away
- Account for all occupants
- Do not use elevators

**When to Call 911:** Immediately for any fire or smoke.`,
    
    accident: `**Immediate Actions:**
- Call 911 if there are injuries
- Move to a safe location away from traffic
- Turn on hazard lights if in a vehicle
- Check for injuries to yourself and others

**Safety Protocols:**
- Do not move injured persons unless in danger
- Exchange information with other parties
- Document the scene if safe to do so

**When to Call 911:** For any injuries, blocked roadways, or vehicle damage.`,
    
    assault: `**Immediate Actions:**
- Move to a safe, public location
- Call 911 immediately
- Do not confront the aggressor
- Seek help from nearby people or businesses

**Safety Protocols:**
- Preserve evidence if possible
- Note details about the incident
- Seek medical attention if injured

**When to Call 911:** Immediately if you or someone else is in danger.`,
    
    suspicious: `**Immediate Actions:**
- Maintain a safe distance
- Note details about the situation
- Call 911 if you believe there is immediate danger
- Do not confront suspicious persons

**Safety Protocols:**
- Trust your instincts
- Alert building security if applicable
- Note any vehicle descriptions or license plates

**When to Call 911:** If you believe a crime is in progress or someone is in danger.`,
    
    theft: `**Immediate Actions:**
- Ensure your personal safety first
- Do not confront the suspect
- Call 911 if the crime is in progress
- Move to a safe location

**Safety Protocols:**
- Note suspect descriptions
- Preserve the scene if safe
- Contact police non-emergency line for reports

**When to Call 911:** If the suspect is still present or if violence occurred.`,
    
    other: `**Immediate Actions:**
- Assess the situation for immediate danger
- Call 911 if anyone is at risk
- Move to a safe location
- Follow official instructions if provided

**Safety Protocols:**
- Do not put yourself at risk
- Alert authorities to the situation
- Stay informed through official channels

**When to Call 911:** If there is any immediate threat to life or property.`,
  };

  return guidanceMap[category] || guidanceMap.other;
}
