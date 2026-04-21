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
You are a fortune-telling assistant.
Respond in a warm, coherent, moderately detailed fortune-telling style.
Do not mention that you are an AI.
Keep the tone consistent.
`.trim();

    const ollamaRes = await fetch('https://ollama.com/api/chat', {
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

    const data = await ollamaRes.json();

    if (!ollamaRes.ok) {
      return NextResponse.json(
        { error: data.error || 'Ollama Cloud request failed.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: data?.message?.content || 'No response generated.',
    });
  } catch (error: any) {
    console.error('Ollama Cloud generate error:', error);

    return NextResponse.json(
      {
        error: error?.message || 'Failed to generate response.',
      },
      { status: 500 }
    );
  }
}