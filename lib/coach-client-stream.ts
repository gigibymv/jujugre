/**
 * Consume NDJSON lines from /api/coach streaming responses.
 * Uses incremental TextDecoder (no TextDecoderStream) for older Safari / embedded WebViews.
 */
export type NdjsonCoachEvent = {
  c?: string;
  replace?: string;
  done?: boolean;
  protocolCompliant?: boolean;
  error?: string;
};

export async function consumeCoachNdjsonStream(
  body: ReadableStream<Uint8Array>,
  onEvent: (ev: NdjsonCoachEvent) => void
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  const flushLine = (line: string) => {
    const t = line.trim();
    if (!t) return;
    try {
      onEvent(JSON.parse(t) as NdjsonCoachEvent);
    } catch {
      /* ignore malformed line */
    }
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        buf += decoder.decode();
        for (const raw of buf.split('\n')) flushLine(raw);
        return;
      }
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const line of lines) flushLine(line);
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* released */
    }
  }
}
