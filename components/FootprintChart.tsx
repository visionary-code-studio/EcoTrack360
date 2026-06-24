'use client';

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, CartesianGrid,
  Area, AreaChart,
} from 'recharts';
import { FootprintSummary, ActivityEntry, Category } from '@/lib/carbon';
import { useState } from 'react';

const COLORS: Record<string, string> = {
  transport:   '#22c55e',
  electricity: '#0ea5e9',
  food:        '#f59e0b',
  waste:       '#a78bfa',
  shopping:    '#f87171',
};

const LABELS: Record<string, string> = {
  transport:   'Transport',
  electricity: 'Electricity',
  food:        'Food',
  waste:       'Waste',
  shopping:    'Shopping',
};

interface Props {
  summary: FootprintSummary;
  activities: ActivityEntry[];
}

// Build daily trend data for the last 7 days
function buildTrendData(activities: ActivityEntry[]) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    days[key] = 0;
  }
  for (const a of activities) {
    const d = new Date(a.date);
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (key in days) days[key] += a.co2e;
  }
  return Object.entries(days).map(([date, co2e]) => ({ date, co2e: parseFloat(co2e.toFixed(2)) }));
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-sm" style={{ minWidth: 120 }}>
        <p className="text-gray-300 mb-1.5 font-medium text-xs">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill || '#22c55e' }} />
            <p style={{ color: p.color || p.fill || '#22c55e' }} className="text-xs">
              {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value} kg</strong>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FootprintChart({ summary, activities }: Props) {
  const [activeTab, setActiveTab] = useState<'pie' | 'bar' | 'trend'>('pie');

  const pieData = (Object.entries(summary.byCategory) as [Category, number][])
    .filter(([, v]) => v > 0)
    .map(([cat, val]) => ({ name: LABELS[cat], value: parseFloat(val.toFixed(2)), cat }));

  const barData = (Object.entries(summary.byCategory) as [Category, number][]).map(([cat, val]) => ({
    name: LABELS[cat],
    co2e: parseFloat(val.toFixed(2)),
    fill: COLORS[cat],
  }));

  const trendData = buildTrendData(activities);

  const tabs = [
    { key: 'pie', label: '🥧 Donut' },
    { key: 'bar', label: '📊 Bar' },
    { key: 'trend', label: '📈 Trend' },
  ] as const;

  // Compute active slice for center display
  const topEntry = pieData.sort((a, b) => b.value - a.value)[0];

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-bold text-lg">Emissions Breakdown</h2>
          <p className="text-gray-500 text-xs mt-0.5">All logged activities · {summary.total.toFixed(2)} kg total</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === t.key
                  ? 'bg-eco-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 290 }}>
        {activeTab === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={112}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[entry.cat]}
                    opacity={0.88}
                    stroke={COLORS[entry.cat]}
                    strokeWidth={0.5}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7f6b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7f6b', fontSize: 11 }} unit=" kg" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34,197,94,0.05)' }} />
              <Bar dataKey="co2e" name="CO₂e" radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'trend' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="co2eGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#6b7f6b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7f6b', fontSize: 11 }} unit=" kg" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="co2e"
                name="CO₂e"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#co2eGradient)"
                dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#4ade80', strokeWidth: 2, stroke: '#86efac' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Total display */}
      <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(34,197,94,0.12)' }}>
        <div className="flex items-center gap-3">
          {pieData.slice(0, 3).map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: COLORS[d.cat] }} />
              <span className="text-xs text-gray-500">{d.name}</span>
            </div>
          ))}
        </div>
        <span className="text-eco-400 font-bold text-sm">{summary.total.toFixed(2)} kg CO₂e</span>
      </div>
    </div>
  );
}
