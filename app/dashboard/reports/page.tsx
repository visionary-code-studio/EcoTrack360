'use client';

import { useApp } from '@/components/AppProvider';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { Category } from '@/lib/carbon';

const CATEGORY_COLORS: Record<string, string> = {
  transport:   '#22c55e',
  electricity: '#0ea5e9',
  food:        '#f59e0b',
  waste:       '#a78bfa',
  shopping:    '#f87171',
};

const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transport',
  electricity: 'Electricity',
  food: 'Food',
  waste: 'Waste',
  shopping: 'Shopping',
};

interface WeeklyDayData {
  date: string;
  transport: number;
  electricity: number;
  food: number;
  waste: number;
  shopping: number;
  total: number;
  [key: string]: any;
}

function buildWeeklyData(activities: ReturnType<typeof useApp>['activities']): WeeklyDayData[] {
  const days: Record<string, Record<string, number>> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    days[key] = { transport: 0, electricity: 0, food: 0, waste: 0, shopping: 0, total: 0 };
  }
  for (const a of activities) {
    const d = new Date(a.date);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    if (days[key]) {
      days[key][a.category] = (days[key][a.category] ?? 0) + a.co2e;
      days[key].total += a.co2e;
    }
  }
  return Object.entries(days).map(([date, vals]) => ({
    date: date.split(',')[0], // just weekday
    ...Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, parseFloat((v as number).toFixed(2))])),
  })) as unknown as WeeklyDayData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-gray-300 font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.fill }}>
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value} kg</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const { activities, summary, goal } = useApp();

  const weeklyData = buildWeeklyData(activities);
  const totalThisWeek = weeklyData.reduce((acc, d) => acc + (d.total as number), 0);

  const categoryData = (Object.entries(summary.byCategory) as [Category, number][])
    .filter(([, v]) => v > 0)
    .map(([cat, val]) => ({
      name: CATEGORY_LABELS[cat],
      value: parseFloat(val.toFixed(2)),
      fill: CATEGORY_COLORS[cat],
    }));

  const insights = [
    {
      icon: '📊',
      title: 'Weekly Total',
      value: `${totalThisWeek.toFixed(1)} kg CO₂e`,
      desc: totalThisWeek < 100 ? 'Below average — great work!' : 'Above average — focus on reducing transport and food.',
    },
    {
      icon: '🏆',
      title: 'Best Category',
      value: (() => {
        const min = (Object.entries(summary.byCategory) as [string, number][]).sort(([,a],[,b]) => a - b)[0];
        return min ? `${CATEGORY_LABELS[min[0]]} (${min[1].toFixed(1)} kg)` : 'N/A';
      })(),
      desc: 'Your lowest-emission category this period.',
    },
    {
      icon: '⚡',
      title: 'Eco Score',
      value: `${summary.ecoScore} / 100`,
      desc: summary.ecoScore >= 70 ? 'Excellent environmental performance!' : 'Keep reducing to improve your score.',
    },
    {
      icon: '🎯',
      title: 'Budget Usage',
      value: `${Math.round((summary.total / goal) * 100)}%`,
      desc: `${summary.total.toFixed(1)} kg of ${goal} kg monthly budget used.`,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-black text-white">📋 Reports</h1>
        <p className="text-gray-400 text-sm mt-1">Weekly and category-level emission analysis</p>
      </div>

      {/* Insight cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {insights.map((ins, i) => (
          <div key={i} className="glass-card p-5">
            <span className="text-2xl">{ins.icon}</span>
            <div className="text-lg font-black text-white mt-2 stat-number">{ins.value}</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">{ins.title}</div>
            <div className="text-xs text-gray-500 mt-2">{ins.desc}</div>
          </div>
        ))}
      </div>

      {/* Weekly stacked bar chart */}
      <div className="glass-card p-6">
        <h2 className="text-white font-bold text-lg mb-5">📅 7-Day Emission Breakdown</h2>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#6b7f6b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7f6b', fontSize: 11 }} unit=" kg" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{CATEGORY_LABELS[v] ?? v}</span>} />
              {(Object.keys(CATEGORY_COLORS) as Category[]).map((cat) => (
                <Bar key={cat} dataKey={cat} stackId="a" fill={CATEGORY_COLORS[cat]} name={cat} radius={cat === 'shopping' ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category pie + line trend */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-white font-bold text-lg mb-5">🥧 Category Share</h2>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" paddingAngle={3}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-white font-bold text-lg mb-5">📈 Daily Trend</h2>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#6b7f6b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7f6b', fontSize: 11 }} unit=" kg" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total CO₂e"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6, fill: '#4ade80' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity log table */}
      <div className="glass-card p-6">
        <h2 className="text-white font-bold text-lg mb-5">📃 Full Activity Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                <th className="pb-3 text-left">Date</th>
                <th className="pb-3 text-left">Category</th>
                <th className="pb-3 text-left">Activity</th>
                <th className="pb-3 text-right">Quantity</th>
                <th className="pb-3 text-right">CO₂e (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              {activities.map((a) => (
                <tr key={a.id} className="hover:bg-surface-700 transition-colors">
                  <td className="py-2.5 text-gray-400">
                    {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-2.5">
                    <span className="badge badge-eco text-xs capitalize">{a.category}</span>
                  </td>
                  <td className="py-2.5 text-gray-300 capitalize">
                    {a.type.replace(/_/g, ' ')}
                  </td>
                  <td className="py-2.5 text-right text-gray-400">{a.quantity}</td>
                  <td className="py-2.5 text-right font-semibold" style={{ color: CATEGORY_COLORS[a.category] }}>
                    {a.co2e.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-eco-900 border-opacity-30">
                <td colSpan={4} className="pt-3 text-gray-400 text-xs font-medium">Total</td>
                <td className="pt-3 text-right font-black text-eco-400">{summary.total.toFixed(3)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
