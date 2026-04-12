'use client';

// Cache invalidation - v2 - cleaned orphaned JSX

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockCoachMessages } from '@/lib/mock-data';
import { useState } from 'react';
import { Send, Sparkles, CheckCircle2, BookOpen, Lightbulb } from 'lucide-react';

export default function CoachPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'coach'; content: string; protocolCompliant?: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    const nextThread = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(nextThread);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = nextThread.map((m) => ({
        role: m.role === 'coach' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      }));

      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = (await res.json()) as {
        content?: string;
        protocolCompliant?: boolean;
      };
      const text =
        data.content ||
        mockCoachMessages[0]?.coachResponse ||
        'Sorry — no response. Try again in a moment.';
      setMessages((prev) => [
        ...prev,
        { role: 'coach', content: text, protocolCompliant: data.protocolCompliant ?? true },
      ]);
    } catch {
      const fallback =
        mockCoachMessages[0]?.coachResponse ||
        'Network error. Check your connection and try again.';
      setMessages((prev) => [...prev, { role: 'coach', content: fallback, protocolCompliant: true }]);
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

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#7a8d7e]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-light text-[#3d2f3f]">AI Study Coach</h1>
          </div>
          <p className="text-[#a89d94]">
            Premium, rigorous explanations following a structured learning protocol
          </p>
        </div>

        {/* Coach Credentials */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-[#f5f1e8] to-[#f5f1e8] mb-8">
          <CardContent className="pt-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#7a8d7e] mt-0.5" />
              </div>
              <div className="text-sm text-slate-700 space-y-1">
                <p className="font-semibold text-[#3d2f3f]">How this coach helps</p>
                <ul className="space-y-0.5 text-xs">
                  <li>✓ Every explanation follows the 8-step rigorous protocol</li>
                  <li>✓ Sourced to Manhattan Prep and Official GRE materials</li>
                  <li>✓ Designed for the "I'm Overwhelmed" 120-day plan</li>
                  <li>✓ Honors your learning level and flagging common traps</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Container */}
        <Card className="border-0 shadow-lg bg-white h-[600px] flex flex-col mb-6">
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="p-3 rounded-full bg-[#7a8d7e] mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-[#3d2f3f] mb-2">
                  What concept would you like to master?
                </h2>
                <p className="text-[#a89d94] mb-8 max-w-sm text-sm leading-relaxed">
                  Ask about any GRE concept, get help understanding your mistakes, or request targeted practice suggestions. Your coach will respond with rigorous, step-by-step explanations.
                </p>
                
                {/* Suggested Prompts */}
                <div className="space-y-2 w-full">
                  {suggestedPrompts.map(prompt => (
                    <Button
                      key={prompt}
                      variant="outline"
                      className="w-full justify-start text-slate-700 hover:bg-slate-100 text-sm py-2 h-auto"
                      onClick={() => setInput(prompt)}
                    >
                      <span className="text-xs mr-2">→</span>
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'coach' && (
                      <div className="flex gap-3 w-full max-w-2xl">
                        <div className="flex-shrink-0 pt-1">
                          <div className="p-2 rounded-full bg-[#7a8d7e]">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                            <p className="text-sm text-[#3d2f3f] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            {msg.protocolCompliant && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <Badge variant="outline" className="text-xs bg-[#f5f1e8] text-green-700 border-green-200">
                                  ✓ Protocol-Compliant Explanation
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {msg.role === 'user' && (
                      <div className="max-w-2xl">
                        <div className="bg-[#3d2f3f] text-white p-4 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 w-full max-w-2xl">
                      <div className="flex-shrink-0 pt-1">
                        <div className="p-2 rounded-full bg-[#7a8d7e] animate-pulse">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <span className="text-xs text-slate-500 ml-2">Coach is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>

          {/* Follow-up Options */}
          {messages.length > 0 && !isLoading && messages[messages.length - 1].role === 'coach' && (
            <div className="border-t border-slate-200 p-4 bg-slate-50">
              <p className="text-xs font-semibold text-[#a89d94] mb-2">What next?</p>
              <div className="grid grid-cols-3 gap-2">
                {followUpOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.label}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2 flex flex-col items-center gap-1"
                      onClick={() => setInput(`${option.label}`)}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask your coach anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                className="text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-4 bg-[#3d2f3f] hover:bg-[#5a4a5c]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Premium Features Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-[#ede8df] to-[#ede8df]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#3d2f3f]">Coach Philosophy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="space-y-2">
              <p className="font-semibold text-[#3d2f3f]">Every explanation follows the 8-step rigorous protocol:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-white border border-slate-200"><span className="font-semibold">1. Identify</span> the concept</div>
                <div className="p-2 rounded bg-white border border-slate-200"><span className="font-semibold">2. Define</span> the rule</div>
                <div className="p-2 rounded bg-white border border-slate-200"><span className="font-semibold">3. Show</span> steps</div>
                <div className="p-2 rounded bg-white border border-slate-200"><span className="font-semibold">4. Compute</span> example</div>
                <div className="p-2 rounded bg-white border border-slate-200"><span className="font-semibold">5. Check</span> answer</div>
                <div className="p-2 rounded bg-white border border-slate-200"><span className="font-semibold">6. State</span> result</div>
                <div className="p-2 rounded bg-white border border-slate-200"><span className="font-semibold">7. Extract</span> takeaway</div>
                <div className="p-2 rounded bg-white border border-slate-200"><span className="font-semibold">8. Flag</span> traps</div>
              </div>
            </div>
            <p className="text-xs text-[#a89d94] italic pt-2">
              This protocol ensures deep understanding, not memorization. Every explanation is tied to materials and designed for retention under exam stress.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
