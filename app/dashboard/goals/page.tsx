'use client';

import { useState } from 'react';
import { useApp } from '@/components/AppProvider';
import { BADGE_THRESHOLDS, MONTHLY_BUDGET } from '@/lib/carbon';

const PRESET_GOALS = [
  { label: 'Ambitious', value: 200, desc: 'Below global average — for the eco warrior', color: '#22c55e' },
  { label: 'Balanced', value: 400, desc: 'Recommended monthly target', color: '#0ea5e9' },
  { label: 'Moderate', value: 600, desc: 'Good starting point for beginners', color: '#f59e0b' },
  { label: 'Standard', value: 800, desc: 'Average global footprint', color: '#f87171' },
];

export default function GoalsPage() {
  const { summary, activities, goal, setGoal } = useApp();
  const [customGoal, setCustomGoal] = useState('');

  const pct = Math.min(100, Math.round((summary.total / goal) * 100));
  const remaining = Math.max(0, goal - summary.total);
  const earned = BADGE_THRESHOLDS.filter((b) => b.condition(activities.length));
  const allBadges = BADGE_THRESHOLDS;

  const streak = Math.min(activities.length, 7); // Simulated streak

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-black text-white">🎯 Goals & Progress</h1>
        <p className="text-gray-400 text-sm mt-1">Set reduction targets and track your sustainability journey</p>
      </div>

      {/* Current Goal Status */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-white font-bold text-xl">Monthly Carbon Budget</h2>
            <p className="text-gray-400 text-sm mt-1">Current goal: {goal} kg CO₂e per month</p>
          </div>
          <div className="badge badge-eco text-sm">
            {pct < 50 ? '🌿 On Track' : pct < 80 ? '⚠️ Caution' : '🔴 Over Budget'}
          </div>
        </div>

        {/* Big progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Used: <span className="text-white font-bold">{summary.total.toFixed(1)} kg</span></span>
            <span className="text-gray-400">Goal: <span className="text-white font-bold">{goal} kg</span></span>
          </div>
          <div className="h-6 bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-1000"
              style={{
                width: `${pct}%`,
                background: pct < 50
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : pct < 80
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
                minWidth: pct > 5 ? 'auto' : 0,
              }}
            >
              {pct > 15 && <span className="text-white text-xs font-bold">{pct}%</span>}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {remaining > 0 ? `${remaining.toFixed(1)} kg remaining this month` : 'Monthly budget exceeded'}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="text-2xl font-black text-eco-400 stat-number">{summary.ecoScore}</div>
            <div className="text-xs text-gray-400">Eco Score</div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>
            <div className="text-2xl font-black text-ocean-500 stat-number">{streak}🔥</div>
            <div className="text-xs text-gray-400">Day Streak</div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="text-2xl font-black text-yellow-400 stat-number">{earned.length}</div>
            <div className="text-xs text-gray-400">Badges Earned</div>
          </div>
        </div>
      </div>

      {/* Set Goal */}
      <div className="glass-card p-6">
        <h2 className="text-white font-bold text-lg mb-4">⚙️ Set Your Goal</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {PRESET_GOALS.map((pg) => (
            <button
              key={pg.value}
              onClick={() => setGoal(pg.value)}
              className={`p-4 rounded-xl text-left transition-all hover:scale-[1.02]`}
              style={{
                background: goal === pg.value ? pg.color + '20' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${goal === pg.value ? pg.color + '60' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div className="font-bold text-sm mb-1" style={{ color: goal === pg.value ? pg.color : '#9ca3af' }}>
                {pg.label}
              </div>
              <div className="text-xl font-black" style={{ color: goal === pg.value ? pg.color : '#e5e7eb' }}>
                {pg.value} kg
              </div>
              <div className="text-xs text-gray-500 mt-1">{pg.desc}</div>
            </button>
          ))}
        </div>

        {/* Custom goal input */}
        <div className="flex gap-3">
          <input
            type="number"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className="eco-input"
            placeholder="Or enter custom goal (kg CO₂e/month)"
            min="50"
            max="2000"
          />
          <button
            onClick={() => {
              const v = parseInt(customGoal);
              if (v >= 50 && v <= 2000) { setGoal(v); setCustomGoal(''); }
            }}
            className="eco-btn px-6 whitespace-nowrap"
          >
            Set Goal
          </button>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card p-6">
        <h2 className="text-white font-bold text-lg mb-5">🏆 Achievements</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const isEarned = badge.condition(activities.length);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl flex items-center gap-4 transition-all ${isEarned ? '' : 'opacity-40 grayscale'}`}
                style={{
                  background: isEarned ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isEarned ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <span className="text-4xl">{badge.icon}</span>
                <div>
                  <div className={`font-bold text-sm ${isEarned ? 'text-white' : 'text-gray-400'}`}>
                    {badge.label}
                  </div>
                  <div className="text-xs text-gray-500">{badge.desc}</div>
                  {isEarned && <span className="badge badge-eco text-xs mt-1">Earned ✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivation card */}
      <div
        className="p-6 rounded-2xl text-center"
        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(14,165,233,0.1))', border: '1px solid rgba(34,197,94,0.2)' }}
      >
        <div className="text-4xl mb-3">🌍</div>
        <h3 className="text-white font-bold text-xl mb-2">Every Action Counts</h3>
        <p className="text-gray-300 text-sm max-w-md mx-auto">
          You've logged <strong className="text-eco-400">{activities.length} activities</strong> and recorded{' '}
          <strong className="text-eco-400">{summary.total.toFixed(1)} kg CO₂e</strong>. Your awareness is the first step to building a sustainable lifestyle.
        </p>
      </div>
    </div>
  );
}
