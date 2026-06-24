'use client';

import { useState } from 'react';
import { useApp } from '@/components/AppProvider';
import { getRecommendations, EMISSION_FACTORS, Category } from '@/lib/carbon';

const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transport',
  electricity: 'Electricity',
  food: 'Food',
  waste: 'Waste',
  shopping: 'Shopping',
};

const CATEGORY_ICONS: Record<string, string> = {
  transport: '🚗',
  electricity: '⚡',
  food: '🍽️',
  waste: '♻️',
  shopping: '🛍️',
};

const QUICK_PROMPTS = [
  'What are my biggest carbon reduction opportunities?',
  'How do my food choices impact the environment?',
  'Give me a 30-day sustainability challenge',
  'How does my footprint compare to the global average?',
  'What are the easiest changes I can make right now?',
  'Explain the science behind my top emission category',
];

export default function InsightsPage() {
  const { summary, activities } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const staticRecs = getRecommendations(summary.topCategory);

  const contextSummary = `
User's carbon footprint data:
- Total CO₂e: ${summary.total.toFixed(2)} kg
- Eco Score: ${summary.ecoScore}/100
- Top emission category: ${summary.topCategory}
- Category breakdown: ${Object.entries(summary.byCategory).map(([k, v]) => `${k}: ${v.toFixed(2)}kg`).join(', ')}
- Total activities logged: ${activities.length}
  `.trim();

  const sendMessage = async (text?: string) => {
    const userText = text ?? input.trim();
    if (!userText) return;
    setInput('');
    setError('');

    const newMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: contextSummary,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? 'AI service unavailable');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content }]);
    } catch (e: any) {
      setError(e.message ?? 'Failed to get AI response. Please try again.');
      setMessages(newMessages); // keep user message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-black text-white">🤖 AI Insights</h1>
        <p className="text-gray-400 text-sm mt-1">
          Powered by Groq + LLaMA 3.3 — personalized carbon coaching based on your data
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Panel */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col" style={{ minHeight: 580 }}>
          {/* Context banner */}
          <div
            className="mb-4 px-4 py-3 rounded-xl text-xs flex items-start gap-2"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}
          >
            <span>🧠</span>
            <div>
              <span className="text-eco-400 font-semibold">Context loaded: </span>
              <span className="text-gray-400">
                {summary.total.toFixed(1)} kg CO₂e · Eco Score {summary.ecoScore} · Top: {summary.topCategory}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1" style={{ maxHeight: 360 }}>
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">🌱</div>
                <div className="text-gray-400 text-sm">Ask me anything about your carbon footprint!</div>
                <div className="text-gray-500 text-xs mt-1">Try one of the quick prompts below →</div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-sm'
                      : 'text-gray-200 rounded-bl-sm'
                  }`}
                  style={
                    msg.role === 'user'
                      ? { background: 'linear-gradient(135deg, #22c55e, #16a34a)' }
                      : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-2 text-eco-400 text-xs font-semibold">
                      <span>🤖</span> EcoAI Coach
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 text-eco-400 text-xs mb-2">
                    <span>🤖</span> EcoAI Coach
                  </div>
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-2 h-2 rounded-full bg-eco-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-eco-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-eco-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="text-center py-2 text-xs text-red-400 bg-red-900 bg-opacity-20 rounded-xl px-4 py-3">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Quick Prompts</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.slice(0, 3).map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-full transition-all hover:border-eco-500 hover:text-eco-300 disabled:opacity-40"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              className="eco-input flex-1"
              placeholder="Ask about your carbon footprint..."
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="eco-btn px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? '⏳' : '→'}
            </button>
          </div>
        </div>

        {/* Sidebar: Static Recommendations + Info */}
        <div className="space-y-5">
          {/* Current context card */}
          <div className="glass-card p-5">
            <h3 className="text-white font-bold mb-4">📊 Your Data Context</h3>
            <div className="space-y-3">
              {Object.entries(summary.byCategory).map(([cat, val]) => (
                <div key={cat} className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span className="text-xs text-gray-400 flex-1">{CATEGORY_LABELS[cat]}</span>
                  <span className="text-xs font-semibold text-gray-200">{val.toFixed(2)} kg</span>
                </div>
              ))}
              <div className="border-t border-eco-900 border-opacity-20 pt-3 flex justify-between">
                <span className="text-xs text-gray-400">Total</span>
                <span className="text-sm font-bold text-eco-400">{summary.total.toFixed(2)} kg</span>
              </div>
            </div>
          </div>

          {/* Top recommendations */}
          <div className="glass-card p-5">
            <h3 className="text-white font-bold mb-4">💡 Top Tips</h3>
            <div className="space-y-2">
              {staticRecs.slice(0, 4).map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-eco-400 font-bold mt-0.5">{i + 1}.</span>
                  <span className="text-gray-400 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* More quick prompts */}
          <div className="glass-card p-5">
            <h3 className="text-white font-bold mb-3">💬 More to Ask</h3>
            <div className="space-y-2">
              {QUICK_PROMPTS.slice(3).map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  disabled={loading}
                  className="w-full text-left text-xs p-2 rounded-lg text-gray-400 hover:text-eco-300 transition-all hover:bg-eco-900 hover:bg-opacity-20 disabled:opacity-40"
                >
                  → {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
