import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    // Check API key first
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: '❌ Missing API Key: Create a .env file in your style-decoder root folder with: ANTHROPIC_API_KEY=your_key_here' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { projectType, description, mustHave, mustAvoid, inspirationLinks } = body;

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `You are an expert interior design consultant. Your job is NOT to describe style — it is to create a binding design alignment document that protects both the designer and the client from costly late-stage conflicts.

Project Type: ${projectType}
Client Description: ${description}
Must-Have Elements: ${mustHave || 'None specified'}
Must-Avoid Elements: ${mustAvoid || 'None specified'}
Inspiration Links: ${inspirationLinks || 'None provided'}

Generate a Design Alignment Contract with these sections. Be specific, decisive, and concrete — use rules, not adjectives.

1. PRIMARY STYLE: Name the style (e.g. "Warm Modern Organic") and in 2-3 sentences explain WHY this is the correct direction based on everything the client said. Be decisive.

2. SECONDARY INFLUENCES: 2-3 complementary sub-styles that support the primary. Brief, one sentence each.

3. DESIGN RULES (not adjectives): Translate the style into 6-8 concrete, actionable rules.
   GOOD: "No pure white walls — use warm off-whites (e.g. Benjamin Moore White Dove)"
   BAD: "Use warm neutrals"
   GOOD: "Minimum 2 layered light sources per room"
   BAD: "Good lighting"
   GOOD: "No chrome or high-gloss finishes"
   BAD: "Natural materials preferred"

4. DECISION LOCKS: List 4-6 key decisions that are NOW locked based on the client input. These are the non-negotiables that the client is approving. Format each as a clear decision statement (e.g. "Color temperature: Warm", "Material finish: Natural/matte only", "Lighting mood: Soft and layered").

5. DESIGN CONSEQUENCES: For each major direction chosen, list what happens if it gets ignored or changed mid-project. Be blunt and realistic. Include impacts on: budget, timeline, visual cohesion, and client satisfaction. Format as 4-5 concrete risk statements.

6. CONTRADICTIONS & RESOLUTIONS: Identify any conflicting desires in the client input. For each contradiction, propose a clear resolution the designer should recommend. Be direct.

7. AVOID LIST: 5-7 specific things to never do in this project. Be concrete (e.g. "No Ikea-style flat-pack as hero furniture pieces" not "Avoid cheap furniture").

8. CLIENT SUMMARY: Write 3-4 sentences the client reads before signing. Plain language. Should make them feel heard AND make the direction feel final and exciting.

Return ONLY a JSON object with these exact keys, no extra text:
{
  "primaryStyle": "Style name + decisive explanation",
  "secondaryInfluences": ["Sub-style 1 + one sentence", "Sub-style 2 + one sentence"],
  "designRules": ["Concrete rule 1", "Concrete rule 2"],
  "decisionLocks": ["Locked decision 1", "Locked decision 2"],
  "designConsequences": ["Risk/consequence 1", "Risk/consequence 2"],
  "contradictions": "Contradictions found and how to resolve each one",
  "avoidList": ["Specific avoid 1", "Specific avoid 2"],
  "clientSummary": "Client-facing approval paragraph"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the text content from Claude's response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Strip markdown code fences if present
    let cleaned = responseText.trim();
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();

    // Find the first { ... } block in case there's extra text around it
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'AI did not return valid structured data. Please try again.' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    const report = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
