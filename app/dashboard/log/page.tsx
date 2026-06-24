'use client';

import { useState, useCallback } from 'react';
import { useApp } from '@/components/AppProvider';
import {
  EMISSION_FACTORS,
  Category,
  calculateCO2e,
  ActivityEntry,
} from '@/lib/carbon';
import ActivityFeed from '@/components/ActivityFeed';

const CATEGORY_META: Record<Category, { label: string; icon: string; color: string }> = {
  transport:   { label: 'Transport',   icon: '🚗', color: '#22c55e' },
  electricity: { label: 'Electricity', icon: '⚡', color: '#0ea5e9' },
  food:        { label: 'Food',        icon: '🍽️', color: '#f59e0b' },
  waste:       { label: 'Waste',       icon: '♻️', color: '#a78bfa' },
  shopping:    { label: 'Shopping',    icon: '🛍️', color: '#f87171' },
};

export default function LogPage() {
  const { addActivity, activities, resetActivities } = useApp();

  const [category, setCategory] = useState<Category>('transport');
  const [type, setType] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [result, setResult] = useState<{ co2e: number; label: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const types = EMISSION_FACTORS[category];
  const selectedType = type ? types[type] : undefined;
  const liveEstimate = type && quantity ? calculateCO2e(category, type, parseFloat(quantity) || 0) : null;

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setType('');
    setResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !quantity) return;
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return;

    const co2e = calculateCO2e(category, type, qty);
    const entry: ActivityEntry = {
      id: `activity-${Date.now()}`,
      category,
      type,
      quantity: qty,
      co2e,
      date: new Date().toISOString(),
      notes: notes || undefined,
    };
    addActivity(entry);
    setResult({ co2e, label: EMISSION_FACTORS[category][type]?.label ?? type });
    setSubmitted(true);

    // Reset after 3s
    setTimeout(() => {
      setType('');
      setQuantity('');
      setNotes('');
      setResult(null);
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-3xl font-black text-white">Log Activity</h1>
          <p className="text-gray-400 text-sm mt-1">Record your daily activities to track your carbon footprint</p>
        </div>
        <button
          onClick={resetActivities}
          className="eco-btn-outline text-xs py-2 px-4"
        >
          🔄 Reset to Sample Data
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass-card p-6">
          <h2 className="text-white font-bold text-lg mb-5">🌿 New Activity</h2>

          {/* Success flash */}
          {submitted && result && (
            <div
              className="mb-5 p-4 rounded-xl text-center fade-in-up"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              <div className="text-2xl mb-1">✅</div>
              <div className="text-eco-400 font-bold">{result.label} logged!</div>
              <div className="text-white font-black text-3xl stat-number">{result.co2e.toFixed(3)} <span className="text-sm text-gray-400">kg CO₂e</span></div>
              <div className="text-gray-400 text-xs mt-1">Added to your dashboard</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category selector */}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
                Emission Category
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
                  const m = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-medium transition-all ${
                        category === cat ? 'scale-105' : 'hover:bg-surface-700'
                      }`}
                      style={{
                        background: category === cat ? m.color + '20' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${category === cat ? m.color + '60' : 'rgba(255,255,255,0.06)'}`,
                        color: category === cat ? m.color : '#6b7280',
                      }}
                    >
                      <span className="text-xl">{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Activity type */}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
                Activity Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="eco-input"
                required
              >
                <option value="">Select activity...</option>
                {Object.entries(types).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.icon} {val.label} ({val.factor} kg CO₂e/{val.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
                Quantity {selectedType ? `(${selectedType.unit})` : ''}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="eco-input"
                placeholder={`Enter amount in ${selectedType?.unit ?? 'units'}`}
                min="0"
                step="any"
                required
              />
              {/* Live estimate */}
              {liveEstimate !== null && liveEstimate > 0 && (
                <div className="mt-2 text-xs text-eco-400 flex items-center gap-1">
                  <span>≈</span>
                  <span className="font-bold">{liveEstimate.toFixed(3)} kg CO₂e</span>
                  <span className="text-gray-500">will be added</span>
                </div>
              )}
              {liveEstimate === 0 && type && (
                <div className="mt-2 text-xs text-ocean-400">
                  ✅ Zero emission activity — great choice!
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
                Notes (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="eco-input"
                placeholder="e.g., commute to office, dinner with family..."
              />
            </div>

            <button
              type="submit"
              className="eco-btn w-full justify-center py-3"
              disabled={!type || !quantity}
            >
              🌿 Calculate & Log Carbon Footprint
            </button>
          </form>

          {/* Emission factor cheat sheet */}
          {type && selectedType && (
            <div
              className="mt-4 p-4 rounded-xl text-sm"
              style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}
            >
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Emission Factor</div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedType.icon}</span>
                <div>
                  <div className="text-white font-medium">{selectedType.label}</div>
                  <div className="text-eco-400 text-xs">
                    {selectedType.factor} kg CO₂e per {selectedType.unit}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick stats & recent */}
        <div className="space-y-6">
          {/* Emission factor reference */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-4">📚 Emission Factor Reference</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {Object.entries(EMISSION_FACTORS[category]).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-700 cursor-pointer"
                  onClick={() => { setType(key); }}
                >
                  <span className="text-lg w-7 text-center">{val.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm text-gray-200">{val.label}</div>
                    <div className="text-xs text-gray-500">{val.unit}</div>
                  </div>
                  <div className="text-xs font-semibold text-eco-400 text-right">
                    {val.factor}<br />
                    <span className="text-gray-500 font-normal">kg CO₂e</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ActivityFeed activities={activities.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
