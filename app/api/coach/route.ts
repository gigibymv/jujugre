import { NextResponse } from 'next/server';
import { mockCoachMessages } from '@/lib/mock-data';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

const COACH_SYSTEM = `You are an expert GRE quantitative reasoning tutor. Always respond with rigorous, exam-relevant explanations. Prefer this structure when it fits: (1) concept (2) rule/formula (3) steps (4) computation (5) check (6) final answer (7) takeaway (8) common trap. Be concise but complete.`;

const NVIDIA_CHAT_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

function genericFallback(userText: string): string {
  return `Here is a structured walkthrough:

1. **Identify the concept** — Name the skill the GRE is testing.
2. **State the rule** — Write the definition or formula precisely.
3. **Show the steps** — Work in small, justified steps.
4. **Compute** — Carry the arithmetic carefully.
5. **Check** — Verify with a quick estimate or substitution.
6. **Answer** — State the result clearly.
7. **Takeaway** — One sentence you can reuse on similar items.
8. **Trap** — Note the mistake students often make here.

Your question: "${userText.slice(0, 200)}"

If you share a specific problem or screenshot description, I can tailor each step to that item.`;
}

function fallbackReply(userText: string): { content: string; protocolCompliant: boolean } {
  const lower = userText.toLowerCase().trim();
  if (lower.length < 4) {
    return { content: genericFallback(userText), protocolCompliant: true };
  }
  const needle = lower.slice(0, 40);
  const match = mockCoachMessages.find((m) => {
    const q = m.userQuestion.toLowerCase();
    const pref = q.slice(0, 30);
    return (
      (needle.length >= 4 && q.includes(needle)) ||
      (pref.length >= 12 && lower.includes(pref))
    );
  });
  if (match) {
    return { content: match.coachResponse, protocolCompliant: match.protocolCompliant };
  }
  return { content: genericFallback(userText), protocolCompliant: true };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body?.messages as ChatMessage[] | undefined;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const userText = lastUser?.content?.trim() || '';

    const apiMessages: ChatMessage[] = [
      { role: 'system', content: COACH_SYSTEM },
      ...messages.filter((m) => m.role !== 'system'),
    ];

    const nvidiaKey = process.env.NVIDIA_API_KEY?.trim();
    if (nvidiaKey) {
      const model = process.env.NVIDIA_MODEL || 'google/gemma-4-31b-it';
      const maxTokens = Number(process.env.NVIDIA_MAX_TOKENS || '8192');
      const temperature = Number(process.env.NVIDIA_TEMPERATURE || '0.7');
      const topP = Number(process.env.NVIDIA_TOP_P || '0.95');
      const enableThinking =
        process.env.NVIDIA_ENABLE_THINKING !== 'false';

      const res = await fetch(NVIDIA_CHAT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${nvidiaKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: apiMessages,
          max_tokens: Number.isFinite(maxTokens) ? maxTokens : 8192,
          temperature: Number.isFinite(temperature) ? temperature : 0.7,
          top_p: Number.isFinite(topP) ? topP : 0.95,
          stream: false,
          ...(enableThinking && {
            chat_template_kwargs: { enable_thinking: true },
          }),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[jujugre] NVIDIA API error:', res.status, errText);
        const fb = fallbackReply(userText);
        return NextResponse.json(fb);
      }

      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        const fb = fallbackReply(userText);
        return NextResponse.json(fb);
      }

      return NextResponse.json({ content, protocolCompliant: true });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      const fb = fallbackReply(userText);
      return NextResponse.json(fb);
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[jujugre] OpenAI error:', res.status, errText);
      const fb = fallbackReply(userText);
      return NextResponse.json(fb);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      const fb = fallbackReply(userText);
      return NextResponse.json(fb);
    }

    return NextResponse.json({ content, protocolCompliant: true });
  } catch (e) {
    console.error('[jujugre] coach API:', e);
    const fb = fallbackReply('');
    return NextResponse.json(fb);
  }
}
