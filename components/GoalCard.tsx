'use client';

import { FootprintSummary } from '@/lib/carbon';
import { BADGE_THRESHOLDS } from '@/lib/carbon';
import { useApp } from './AppProvider';
import { useState } from 'react';

interface GoalCardProps {
  summary: FootprintSummary;
  goal: number;
}

export default function GoalCard({ summary, goal }: GoalCardProps) {
  const { activities, setGoal } = useApp();
  const [showEdit, setShowEdit] = useState(false);
  const [editVal, setEditVal] = useState('');

  const pct = Math.min(100, Math.round((summary.total / goal) * 100));
  const remaining = Math.max(0, goal - summary.total);

  // Earned badges
  const earnedBadges = BADGE_THRESHOLDS.filter((b) => b.condition(activities.length));
  const nextBadge = BADGE_THRESHOLDS.find((b) => !b.condition(activities.length));

  const statusColor = pct < 50 ? '#22c55e' : pct < 80 ? '#f59e0b' : '#f87171';
  const statusLabel = pct < 50 ? '🌿 On Track' : pct < 80 ? '⚠️ Caution' : '🔴 Over Budget';
  const statusBadge = pct < 50 ? 'badge-eco' : pct < 80 ? 'badge-warn' : 'badge-danger';

  // Arc calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.min(pct, 100) / 100);

  const handleSetGoal = () => {
    const v = parseInt(editVal);
    if (!isNaN(v) && v >= 50 && v <= 2000) {
      setGoal(v);
      setShowEdit(false);
      setEditVal('');
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">🎯 Goal Progress</h2>
        <div className="flex items-center gap-2">
          <span className={`badge ${statusBadge} text-xs`}>{statusLabel}</span>
          <button
            onClick={() => setShowEdit(!showEdit)}
            className="text-gray-500 hover:text-eco-400 transition-colors text-xs"
            title="Edit goal"
          >
            ✏️
          </button>
        </div>
      </div>

      {/* Edit goal mini form */}
      {showEdit && (
        <div className="flex gap-2 fade-in-up">
          <input
            type="number"
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            className="eco-input text-sm py-2"
            placeholder="New goal (kg/mo)"
            min="50"
            max="2000"
            onKeyDown={(e) => e.key === 'Enter' && handleSetGoal()}
          />
          <button onClick={handleSetGoal} className="eco-btn text-xs px-3 py-2 whitespace-nowrap">
            Set
          </button>
        </div>
      )}

      {/* Circular progress */}
      <div className="flex items-center justify-center">
        <div className="relative" style={{ width: 148, height: 148 }}>
          <svg width="148" height="148" className="rotate-[-90deg]">
            {/* Background track */}
            <circle cx="74" cy="74" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
            {/* Progress arc */}
            <circle
              cx="74" cy="74" r={radius}
              fill="none"
              stroke={statusColor}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease' }}
            />
            {/* Glow effect */}
            <circle
              cx="74" cy="74" r={radius}
              fill="none"
              stroke={statusColor}
              strokeWidth="2"
              strokeOpacity="0.3"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ filter: 'blur(3px)', transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white stat-number">{pct}%</span>
            <span className="text-xs text-gray-400 mt-0.5">budget used</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}>
          <div className="text-xl font-bold text-eco-400 stat-number">{summary.total.toFixed(1)}</div>
          <div className="text-xs text-gray-400 mt-0.5">kg used</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-xl font-bold text-gray-300 stat-number">{remaining.toFixed(1)}</div>
          <div className="text-xs text-gray-400 mt-0.5">kg remaining</div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>0 kg</span>
          <span>Goal: {goal} kg/mo</span>
        </div>
        <div className="h-3 bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${statusColor}, ${statusColor}cc)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-25" />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex-1">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Achievements</div>
        {earnedBadges.length === 0 && (
          <span className="text-xs text-gray-500">Log your first activity to earn badges!</span>
        )}
        <div className="flex flex-wrap gap-2">
          {earnedBadges.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all hover:scale-105"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}
              title={b.desc}
            >
              <span>{b.icon}</span>
              <span className="font-medium">{b.label}</span>
            </div>
          ))}
        </div>
        {nextBadge && (
          <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <span>Next:</span>
            <span>{nextBadge.icon}</span>
            <span>{nextBadge.label}</span>
            <span className="text-gray-600">— {nextBadge.desc}</span>
          </div>
        )}
      </div>
    </div>
  );
}
