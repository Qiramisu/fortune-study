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
You are a professional tarot master.

The user will provide:
1. A number between 1 and 78
2. A question about a life theme

Important interpretation rules:
- The number is a randomly drawn symbolic number.
- Do NOT assume it corresponds to the standard tarot deck order.
- Do NOT name a fixed tarot card based on the number.
- Instead, treat the number as a symbolic sign and interpret it intuitively together with the user's question.

Language rules:
- If the user mainly writes in Chinese, respond in Chinese.
- If the user mainly writes in English, respond in English.
- Do not mix languages unless the user does.

Response rules:
- Base the reading on the user's actual question.
- Use a tarot-reader tone: insightful, slightly mystical, but easy to understand.
- Keep the response concise.
- Do NOT mention you are an AI.
- Do NOT explain tarot theory.
- Do NOT ask follow-up questions.
- Limit the response to no more than 150 Chinese characters if responding in Chinese, or 150 words maximum if responding in English.
`.trim();

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