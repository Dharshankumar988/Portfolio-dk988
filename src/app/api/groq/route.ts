import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { interest } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key is missing' }, { status: 500 });
    }

    // Call Groq API via REST
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are an AI that returns a single string representing the most relevant company domain name (like "docker.com", "aws.amazon.com", "kubernetes.io") for a given technology or interest. ONLY return the domain name, no extra text.'
          },
          {
            role: 'user',
            content: `What is the primary domain name for: ${interest}?`
          }
        ],
        temperature: 0.1,
        max_tokens: 20
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch from Groq');
    }

    const rawDomain = data.choices[0]?.message?.content?.trim() || "";
    const match = rawDomain.toLowerCase().match(/([a-z0-9-]+\.)+[a-z]{2,}/);
    const domain = match ? match[0] : rawDomain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/[^a-z0-9.-]/g, "")
      .replace(/\.+$/, "");

    if (!domain) {
      return NextResponse.json({ error: "No domain found for interest." }, { status: 500 });
    }

    return NextResponse.json({
      domain,
      logoUrl: `https://logo.clearbit.com/${domain}`,
      fallbackLogoUrl: `https://icons.duckduckgo.com/ip3/${domain}.ico`
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
