import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    if (!process.env.OLLAMA_API_KEY) {
      return NextResponse.json(
        { error: 'OLLAMA_API_KEY is missing.' },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are a professional tarot reader.

The user will provide:
1) A number (1–78) representing a tarot card
2) A question related to a life theme

Your task:
- Interpret the tarot meaning based on the number and the question
- Give a short, insightful fortune-telling response
- Keep it relevant to the user's question
- Use a slightly mystical but clear tone

Constraints:
- Do NOT mention you are an AI
- Do NOT explain tarot theory
- Do NOT ask follow-up questions
- Limit response to 150 words maximum
`;

    const res = await fetch('https://ollama.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-oss:120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: false,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Ollama Cloud request failed.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: data?.message?.content || '',
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}