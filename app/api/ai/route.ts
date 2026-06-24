import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are EcoAI Coach, an expert sustainability advisor for the EcoTrack360 platform.
You help users understand and reduce their personal carbon footprint.

Your personality:
- Friendly, encouraging, and science-based
- Give specific, actionable advice
- Use data from the user's actual footprint when available
- Keep responses concise but meaningful (2-4 paragraphs max)
- Use emojis sparingly but effectively
- Always end with one specific action the user can take today

Your expertise covers:
- Carbon footprint calculation and emission factors
- Transportation choices and their environmental impact
- Food systems and dietary changes
- Energy efficiency and renewable energy
- Waste reduction and circular economy
- Sustainable shopping and consumption
- Climate science and environmental policy

When given the user's carbon data, reference it directly in your advice to make it personalized.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const systemMessage = context
      ? `${SYSTEM_PROMPT}\n\nUser's current carbon footprint data:\n${context}`
      : SYSTEM_PROMPT;

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content ?? 'No response generated.';
    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'AI service error. Please check your API key.' },
      { status: 500 }
    );
  }
}
