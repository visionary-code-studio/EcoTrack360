'use client';

import { useApp } from '@/components/AppProvider';
import StatCard from '@/components/StatCard';
import FootprintChart from '@/components/FootprintChart';
import RecommendationList from '@/components/RecommendationList';
import ActivityFeed from '@/components/ActivityFeed';
import GoalCard from '@/components/GoalCard';
import { getRecommendations } from '@/lib/carbon';
import Link from 'next/link';

const CATEGORY_LABELS: Record<string, string> = {
  transport: '🚗 Transport',
  electricity: '⚡ Electricity',
  food: '🍽️ Food',
  waste: '♻️ Waste',
  shopping: '🛍️ Shopping',
};

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#22c55e',
  electricity: '#0ea5e9',
  food: '#f59e0b',
  waste: '#a78bfa',
  shopping: '#f87171',
};

const IMPACT_LABELS: Record<string, string> = {
  transport: 'High — switch to transit',
  electricity: 'Medium — use LED & solar',
  food: 'High — reduce meat intake',
  waste: 'Low — compost & recycle',
  shopping: 'Medium — buy second-hand',
};

export default function DashboardPage() {
  const { summary, activities, goal } = useApp();
  const recs = getRecommendations(summary.topCategory);

  const categoryEntries = Object.entries(summary.byCategory) as [string, number][];
  const totalLogs = activities.length;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '🌅 Good morning' : hour < 17 ? '☀️ Good afternoon' : '🌙 Good evening';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{greeting}</div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Your carbon intelligence hub · {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}
          >
            <div className="w-2 h-2 rounded-full bg-eco-400 pulse-ring" style={{ animation: 'pulse 2s infinite' }} />
            <span className="text-eco-400 font-medium">{totalLogs} activities logged</span>
          </div>
          <Link href="/dashboard/log" className="eco-btn">
            ➕ Log Activity
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        <StatCard
          title="Total Footprint"
          value={`${summary.total.toFixed(1)}`}
          unit="kg CO₂e"
          icon="🌍"
          color="eco"
          subtitle={`of ${goal} kg budget`}
          trend={summary.total > goal * 0.8 ? 'up' : 'down'}
        />
        <StatCard
          title="Top Category"
          value={CATEGORY_LABELS[summary.topCategory]?.split(' ')[1] ?? summary.topCategory}
          unit=""
          icon={CATEGORY_LABELS[summary.topCategory]?.split(' ')[0] ?? '📊'}
          color="warn"
          subtitle="Biggest source"
        />
        <StatCard
          title="Eco Score"
          value={`${summary.ecoScore}`}
          unit="/ 100"
          icon="⭐"
          color="ocean"
          subtitle={summary.ecoScore >= 70 ? '🌿 Excellent!' : summary.ecoScore >= 40 ? '🌱 Good progress' : '⚡ Needs work'}
        />
        <StatCard
          title="Activities Logged"
          value={`${totalLogs}`}
          unit="entries"
          icon="📝"
          color="eco"
          subtitle="Total records"
        />
      </div>

      {/* ── Chart + Goal ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FootprintChart summary={summary} activities={activities} />
        </div>
        <div>
          <GoalCard summary={summary} goal={goal} />
        </div>
      </div>

      {/* ── Recommendations + Activity Feed ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecommendationList
          topCategory={summary.topCategory}
          recommendations={recs}
          summary={summary}
        />
        <ActivityFeed activities={activities.slice(0, 8)} />
      </div>

      {/* ── Category Breakdown ── */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">📊 Category Breakdown</h2>
          <span className="text-xs text-gray-500">{summary.total.toFixed(2)} kg total</span>
        </div>
        <div className="space-y-4">
          {categoryEntries
            .sort(([, a], [, b]) => b - a)
            .map(([cat, val]) => {
              const pct = summary.total > 0 ? Math.round((val / summary.total) * 100) : 0;
              const color = CATEGORY_COLORS[cat] ?? '#22c55e';
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="text-sm text-gray-300 font-medium">{CATEGORY_LABELS[cat] ?? cat}</span>
                      <span className="text-xs text-gray-600 hidden sm:block">· {IMPACT_LABELS[cat] ?? ''}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold" style={{ color }}>
                        {val.toFixed(2)} kg
                      </span>
                      <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-surface-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                      style={{ width: `${pct}%`, background: color }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20" />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ── Quick Action Cards ── */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            href: '/dashboard/insights',
            icon: '🤖',
            title: 'Ask AI Coach',
            desc: 'Get personalized recommendations from Groq AI',
            color: '#0ea5e9',
          },
          {
            href: '/dashboard/goals',
            icon: '🎯',
            title: 'Set Goals',
            desc: 'Define your monthly carbon reduction targets',
            color: '#22c55e',
          },
          {
            href: '/dashboard/reports',
            icon: '📋',
            title: 'View Reports',
            desc: 'Weekly analysis and downloadable summaries',
            color: '#f59e0b',
          },
        ].map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="glass-card glass-card-hover p-5 flex items-start gap-4 group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
              style={{ background: card.color + '20' }}
            >
              {card.icon}
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-1">{card.title}</div>
              <div className="text-gray-400 text-xs leading-relaxed">{card.desc}</div>
            </div>
            <div className="ml-auto text-gray-600 group-hover:text-eco-400 transition-colors text-lg self-center">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
