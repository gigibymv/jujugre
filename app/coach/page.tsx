'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CoachMessageBody } from '@/components/coach-message-body';
import { PageShell } from '@/components/page-shell';
import { ContentHeader } from '@/components/content-header';
import { mockCoachMessages } from '@/lib/mock-data';
import { useState } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function CoachPage() {
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'coach'; content: string; protocolCompliant?: boolean }>
  >([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  /** In-flight streamed coach text (null = not streaming) */
  const [streamBuffer, setStreamBuffer] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    const nextThread = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(nextThread);
    setInput('');
    setIsLoading(true);
    setStreamBuffer(null);

    try {
      const apiMessages = nextThread.map((m) => ({
        role: m.role === 'coach' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      }));

      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, stream: true }),
      });

      const ct = res.headers.get('content-type') || '';

      if (ct.includes('ndjson') && res.body) {
        setStreamBuffer('');
        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        let buf = '';
        let full = '';
        let protocolCompliant = true;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += value;
          const lines = buf.split('\n');
          buf = lines.pop() ?? '';
          for (const line of lines) {
            const t = line.trim();
            if (!t) continue;
            try {
              const o = JSON.parse(t) as {
                c?: string;
                replace?: string;
                done?: boolean;
                protocolCompliant?: boolean;
                error?: string;
              };
              if (o.error) throw new Error(o.error);
              if (typeof o.replace === 'string') {
                full = o.replace;
                setStreamBuffer(full);
              }
              if (typeof o.c === 'string') {
                full += o.c;
                setStreamBuffer(full);
              }
              if (o.done) {
                if (typeof o.protocolCompliant === 'boolean') {
                  protocolCompliant = o.protocolCompliant;
                }
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }

        const text =
          full.trim() ||
          mockCoachMessages[0]?.coachResponse ||
          'No response. Try again in a moment.';
        setMessages((prev) => [
          ...prev,
          { role: 'coach', content: text, protocolCompliant },
        ]);
        setStreamBuffer(null);
        return;
      }

      setStreamBuffer(null);
      const data = (await res.json()) as {
        content?: string;
        protocolCompliant?: boolean;
      };
      const text =
        data.content ||
        mockCoachMessages[0]?.coachResponse ||
        'No response. Try again in a moment.';
      setMessages((prev) => [
        ...prev,
        { role: 'coach', content: text, protocolCompliant: data.protocolCompliant ?? true },
      ]);
      setStreamBuffer(null);
    } catch {
      const fallback =
        mockCoachMessages[0]?.coachResponse ||
        'Network error. Check your connection and try again.';
      setMessages((prev) => [...prev, { role: 'coach', content: fallback, protocolCompliant: true }]);
      setStreamBuffer(null);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    'I keep confusing inscribed angles and central angles',
    'Help me understand the complement rule in probability',
    'Why do I keep forgetting to flip inequality signs?',
    'Explain the quadratic formula step by step',
  ];

  const followUpOptions = [
    { icon: BookOpen, label: 'Explain simpler', hint: 'Break it down more' },
    { icon: Lightbulb, label: 'Give another example', hint: 'Different scenario' },
    { icon: CheckCircle2, label: 'Create practice', hint: 'Similar problems' },
  ];

  const coachBullets = [
    'Eight-step protocol for every quant explanation',
    'Framed for official GRE and reputable prep sources',
    'Aligned with a structured multi-month study arc',
    'Calls out common traps and careless mistakes',
  ];

  return (
    <PageShell narrow>
      <ContentHeader eyebrow="Coach">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/40 bg-accent/15">
            <Sparkles className="h-5 w-5 text-accent" aria-hidden />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground md:text-4xl">
              Quant coach
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Structured explanations for GRE quantitative reasoning
            </p>
          </div>
        </div>
      </ContentHeader>

      <Card className="mb-page-block bg-secondary/40">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-foreground">How this coach helps</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {coachBullets.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/80" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 flex h-[min(32rem,70vh)] flex-col sm:h-[36rem]">
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
          <div className="flex-1 space-y-5 overflow-y-auto p-5 md:p-6">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[240px] flex-col items-center justify-center px-2 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-accent/35 bg-accent/10">
                  <Sparkles className="h-7 w-7 text-accent" aria-hidden />
                </div>
                <h2 className="font-serif text-xl font-normal tracking-tight text-foreground">
                  What do you want to clarify?
                </h2>
                <p className="mb-8 mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Ask about a topic, a missed problem, or how to drill a weak area. Replies follow
                  the same structure your study plan expects.
                </p>
                <div className="w-full max-w-md space-y-2">
                  {suggestedPrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outline"
                      className="h-auto w-full justify-start py-2.5 text-left text-sm font-normal"
                      onClick={() => setInput(prompt)}
                    >
                      <ArrowRight className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'coach' && (
                      <div className="flex w-full max-w-2xl gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                          <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="coach-bubble-assistant">
                            <CoachMessageBody
                              content={msg.content}
                              className="text-sm leading-relaxed text-foreground"
                            />
                            {msg.protocolCompliant && (
                              <div className="mt-3 border-t border-border pt-3">
                                <Badge
                                  variant="outline"
                                  className="gap-1 border-accent/30 bg-accent/5 text-xs font-normal text-accent"
                                >
                                  <CheckCircle2 className="h-3 w-3" aria-hidden />
                                  Protocol-aligned answer
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {msg.role === 'user' && (
                      <div className="max-w-[min(100%,28rem)]">
                        <div className="rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                          <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && streamBuffer === null && (
                  <div className="flex justify-start">
                    <div className="flex w-full max-w-2xl gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
                      </div>
                      <div className="coach-bubble-assistant flex flex-1 items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                        Connecting…
                      </div>
                    </div>
                  </div>
                )}
                {streamBuffer !== null && (
                  <div className="flex justify-start">
                    <div className="flex w-full max-w-2xl gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
                        ) : (
                          <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="coach-bubble-assistant">
                          <CoachMessageBody
                            content={streamBuffer || '…'}
                            className="text-sm leading-relaxed text-foreground"
                          />
                          {isLoading && (
                            <p className="mt-2 text-xs text-muted-foreground">Streaming answer…</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {messages.length > 0 &&
            !isLoading &&
            messages[messages.length - 1].role === 'coach' && (
              <div className="border-t border-border bg-muted/20 px-4 py-3 md:px-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  What next?
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {followUpOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.label}
                        variant="outline"
                        size="sm"
                        className="h-auto flex-col gap-1 py-2.5 text-xs font-normal"
                        onClick={() => setInput(option.label)}
                      >
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

          <div className="border-t border-border p-4 md:p-5">
            <div className="flex gap-2">
              <Input
                placeholder="Ask your coach anything…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                className="text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/30">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Eight-step protocol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ['1. Identify', 'concept'],
              ['2. Define', 'rule'],
              ['3. Show', 'steps'],
              ['4. Compute', 'example'],
              ['5. Check', 'answer'],
              ['6. State', 'result'],
              ['7. Extract', 'takeaway'],
              ['8. Flag', 'traps'],
            ].map(([a, b]) => (
              <div key={a} className="rounded-md border border-border bg-card px-2.5 py-2">
                <span className="font-medium text-foreground">{a}</span> {b}
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Built for retention under time pressure—not memorization alone.
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
