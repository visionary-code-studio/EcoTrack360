'use client';

import { ActivityEntry, Category } from '@/lib/carbon';

const CATEGORY_ICONS: Record<Category, string> = {
  transport: '🚗',
  electricity: '⚡',
  food: '🍽️',
  waste: '♻️',
  shopping: '🛍️',
};

const CATEGORY_COLORS: Record<string, string> = {
  transport:   '#22c55e',
  electricity: '#0ea5e9',
  food:        '#f59e0b',
  waste:       '#a78bfa',
  shopping:    '#f87171',
};

interface Props {
  activities: ActivityEntry[];
}

export default function ActivityFeed({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center min-h-40 text-center">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-gray-400 text-sm">No activities logged yet.</p>
        <a href="/dashboard/log" className="eco-btn mt-4 text-sm py-2 px-4">Log Your First Activity</a>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-bold text-lg">📋 Recent Activities</h2>
        <a href="/dashboard/log" className="text-eco-400 text-xs hover:text-eco-300 transition-colors">
          + Add more
        </a>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {activities.map((a, i) => {
          const color = CATEGORY_COLORS[a.category] ?? '#22c55e';
          const dateStr = new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <div
              key={a.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-surface-700"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: color + '20' }}
              >
                {CATEGORY_ICONS[a.category]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-200 truncate">
                  {a.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="capitalize">{a.category}</span>
                  <span>·</span>
                  <span>{a.quantity} units</span>
                  <span>·</span>
                  <span>{dateStr}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold" style={{ color }}>
                  {a.co2e.toFixed(2)} kg
                </div>
                <div className="text-xs text-gray-500">CO₂e</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
