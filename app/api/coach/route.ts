import { NextResponse } from 'next/server';
import { mockCoachMessages } from '@/lib/mock-data';
import { openAIChatDeltaStream } from '@/lib/coach-sse';

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

const verboseCoach =
  process.env.COACH_VERBOSE === 'true' ||
  process.env.COACH_VERBOSE === '1';

const COACH_SYSTEM = verboseCoach
  ? `You are an expert GRE quantitative reasoning tutor. Always respond with rigorous, exam-relevant explanations. Prefer this structure when it fits: (1) concept (2) rule/formula (3) steps (4) computation (5) check (6) final answer (7) takeaway (8) common trap. Be concise but complete: default to roughly 400–900 words unless the user explicitly asks for a deeper or longer explanation.`
  : `You are an expert GRE quantitative reasoning tutor. Give rigorous, exam-relevant answers using this structure when it fits: (1) concept (2) rule/formula (3) steps (4) computation (5) check (6) answer (7) takeaway (8) common trap. Default length: about 180–420 words. Go shorter for simple questions; expand only if the user asks for more depth.`;

const NVIDIA_CHAT_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

/** Vercel: allow slow GPU responses (Pro plan allows up to 60s; Hobby max is 10s). */
export const maxDuration = 60;

/** Node required for upstream fetch streaming + long-running completions. */
export const runtime = 'nodejs';

function stripThinkingBlocks(text: string): string {
  return text
    .replace(/<redacted_thinking>[\s\S]*?<\/think>/gi, '')
    .replace(/<redacted_thinking>[\s\S]*?<\/redacted_thinking>/gi, '')
    .replace(/<redacted_thinking>[\s\S]*/gi, '')
    .trim();
}

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

function ndjsonResponse(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function ndjsonFromFallback(fb: { content: string; protocolCompliant: boolean }) {
  const enc = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(c) {
      c.enqueue(
        enc.encode(
          `${JSON.stringify({ c: fb.content })}\n${JSON.stringify({ done: true, protocolCompliant: fb.protocolCompliant })}\n`
        )
      );
      c.close();
    },
  });
}

function buildNdjsonStream(upstreamBody: ReadableStream<Uint8Array> | null): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      let full = '';
      try {
        for await (const chunk of openAIChatDeltaStream(upstreamBody)) {
          full += chunk;
          controller.enqueue(enc.encode(`${JSON.stringify({ c: chunk })}\n`));
        }
        const cleaned = stripThinkingBlocks(full);
        if (cleaned !== full) {
          controller.enqueue(enc.encode(`${JSON.stringify({ replace: cleaned })}\n`));
        }
        controller.enqueue(
          enc.encode(`${JSON.stringify({ done: true, protocolCompliant: true })}\n`)
        );
        controller.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'stream error';
        controller.enqueue(enc.encode(`${JSON.stringify({ error: msg })}\n`));
        controller.close();
      }
    },
  });
}

export async function POST(request: Request) {
  let wantStream = false;
  try {
    let body: { messages?: ChatMessage[]; stream?: boolean };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const messages = body?.messages as ChatMessage[] | undefined;
    wantStream = body?.stream === true;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const userText = lastUser?.content?.trim() || '';

    const apiMessages: ChatMessage[] = [
      { role: 'system', content: COACH_SYSTEM },
      ...messages.filter((m) => m.role !== 'system'),
    ];

    const defaultMax = verboseCoach ? 3072 : 1024;
    const nvidiaKey = process.env.NVIDIA_API_KEY?.trim();
    if (nvidiaKey) {
      const model = process.env.NVIDIA_MODEL || 'google/gemma-4-31b-it';
      const maxTokens = Number(process.env.NVIDIA_MAX_TOKENS || String(defaultMax));
      const temperature = Number(process.env.NVIDIA_TEMPERATURE || '0.55');
      const topP = Number(process.env.NVIDIA_TOP_P || '0.92');
      const enableThinking = process.env.NVIDIA_ENABLE_THINKING === 'true';

      const payload = {
        model,
        messages: apiMessages,
        max_tokens: Number.isFinite(maxTokens) ? maxTokens : defaultMax,
        temperature: Number.isFinite(temperature) ? temperature : 0.55,
        top_p: Number.isFinite(topP) ? topP : 0.92,
        stream: wantStream,
        ...(enableThinking && {
          chat_template_kwargs: { enable_thinking: true },
        }),
      };

      const res = await fetch(NVIDIA_CHAT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${nvidiaKey}`,
          'Content-Type': 'application/json',
          Accept: wantStream ? 'text/event-stream' : 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[jujugre] NVIDIA API error:', res.status, errText);
        const fb = fallbackReply(userText);
        if (wantStream) {
          return ndjsonResponse(ndjsonFromFallback(fb));
        }
        return NextResponse.json(fb);
      }

      if (wantStream && res.body) {
        return ndjsonResponse(buildNdjsonStream(res.body));
      }

      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      let content = data.choices?.[0]?.message?.content?.trim();
      if (content) {
        content = stripThinkingBlocks(content);
      }
      if (!content) {
        const fb = fallbackReply(userText);
        return NextResponse.json(fb);
      }

      return NextResponse.json({ content, protocolCompliant: true });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      const fb = fallbackReply(userText);
      if (wantStream) {
        return ndjsonResponse(ndjsonFromFallback(fb));
      }
      return NextResponse.json(fb);
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const openaiMax = Number(process.env.OPENAI_MAX_TOKENS || String(verboseCoach ? 4096 : 900));

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
        Accept: wantStream ? 'text/event-stream' : 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        temperature: 0.4,
        stream: wantStream,
        ...(Number.isFinite(openaiMax) && openaiMax > 0 && { max_tokens: openaiMax }),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[jujugre] OpenAI error:', res.status, errText);
      const fb = fallbackReply(userText);
      if (wantStream) {
        return ndjsonResponse(ndjsonFromFallback(fb));
      }
      return NextResponse.json(fb);
    }

    if (wantStream && res.body) {
      return ndjsonResponse(buildNdjsonStream(res.body));
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
    if (wantStream) {
      return ndjsonResponse(ndjsonFromFallback(fb));
    }
    return NextResponse.json(fb);
  }
}
