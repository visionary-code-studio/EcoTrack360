'use client';

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  icon: string;
  color: 'eco' | 'ocean' | 'warn' | 'danger';
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const colorMap = {
  eco:    { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',   text: '#4ade80', glow: 'rgba(34,197,94,0.15)' },
  ocean:  { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)',  text: '#38bdf8', glow: 'rgba(14,165,233,0.15)' },
  warn:   { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',  text: '#fbbf24', glow: 'rgba(245,158,11,0.15)' },
  danger: { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',   text: '#f87171', glow: 'rgba(239,68,68,0.15)' },
};

export default function StatCard({ title, value, unit, icon, color, subtitle, trend }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] cursor-default"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 24px ${c.glow}`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend === 'down'
              ? 'bg-eco-900 bg-opacity-40 text-eco-400'
              : trend === 'up'
              ? 'bg-red-900 bg-opacity-30 text-red-400'
              : 'bg-gray-800 text-gray-400'
          }`}>
            {trend === 'down' ? '↓ Lower' : trend === 'up' ? '↑ Higher' : '→ Stable'}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-black stat-number" style={{ color: c.text }}>
          {value}
        </span>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>
      <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</div>
      {subtitle && <div className="text-gray-500 text-xs mt-1">{subtitle}</div>}
    </div>
  );
}
