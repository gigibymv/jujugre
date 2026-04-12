/**
 * Parse OpenAI-compatible chat completion SSE (data: {...}\\n\\n).
 */
export async function* openAIChatDeltaStream(
  body: ReadableStream<Uint8Array> | null
): AsyncGenerator<string, void, unknown> {
  if (!body) return;
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';
    for (const block of blocks) {
      const line = block.trim().split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string | null } }>;
        };
        const c = json.choices?.[0]?.delta?.content;
        if (c) yield c;
      } catch {
        /* ignore malformed chunk */
      }
    }
  }
}
