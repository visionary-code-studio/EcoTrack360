'use client';

import { Category, FootprintSummary } from '@/lib/carbon';

const CATEGORY_ICONS: Record<Category, string> = {
  transport: '🚗',
  electricity: '⚡',
  food: '🍽️',
  waste: '♻️',
  shopping: '🛍️',
};

const CATEGORY_COLORS: Record<Category, string> = {
  transport:   '#22c55e',
  electricity: '#0ea5e9',
  food:        '#f59e0b',
  waste:       '#a78bfa',
  shopping:    '#f87171',
};

const SAVING_ESTIMATES: Record<string, string> = {
  'Switch 2 car trips/week to public transit — saves ~8 kg CO₂e': '~8 kg/mo saved',
  'Carpool to work or school to halve your commute emissions': '~50% reduction',
  'Consider an EV or hybrid for your next vehicle': '~60% reduction',
  'Combine errands into a single trip to cut idle mileage': '~2 kg/mo saved',
  'Work from home 1 extra day per week to eliminate commute': '~4 kg/mo saved',
  'Switch to LED bulbs throughout your home — saves ~0.45 kg/day': '~14 kg/mo saved',
  'Set your thermostat 2°C lower in winter, higher in summer': '~10% reduction',
  'Unplug standby appliances — they consume 10% of home energy': '~10% reduction',
  'Wash clothes at 30°C instead of 60°C': '~2 kg/mo saved',
  'Consider a green energy tariff or rooftop solar panels': '~70% reduction',
  'Replace 1 beef meal/week with chicken — saves ~5 kg CO₂e': '~5 kg/mo saved',
  'Try 1 plant-based day per week to cut food emissions by ~14%': '~14% reduction',
  'Buy local and seasonal produce to reduce transport emissions': '~3 kg/mo saved',
  'Reduce food waste by planning meals — wasted food = wasted emissions': '~2 kg/mo saved',
  'Choose sustainable seafood options over farmed salmon or shrimp': '~1.5 kg/mo saved',
  'Start composting food scraps to divert organic waste from landfill': '~1 kg/mo saved',
  'Set up a recycling system at home for paper, plastic, and metal': '~0.5 kg/mo saved',
  'Buy products with less packaging or choose refillable options': '~0.8 kg/mo saved',
  'Donate or resell items instead of disposing of them': '~0.3 kg/mo saved',
  'Repair electronics and clothing rather than replacing them': '~20 kg saved',
  'Buy second-hand clothing instead of new — saves 70% of emissions': '~14 kg/item saved',
  'Choose quality over quantity to reduce frequency of purchases': '~30% reduction',
  'Research product life-cycle impact before buying electronics': '~40 kg/item saved',
  'Rent or borrow rarely used items instead of purchasing': '~10 kg/item saved',
  'Support brands with verified sustainability certifications': '~20% reduction',
};

interface Props {
  topCategory: Category;
  recommendations: string[];
  summary: FootprintSummary;
}

export default function RecommendationList({ topCategory, recommendations, summary }: Props) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-bold text-lg">💡 Recommendations</h2>
        <div className="badge badge-warn text-xs">
          {CATEGORY_ICONS[topCategory]} Top source: {topCategory}
        </div>
      </div>

      <p className="text-gray-400 text-xs mb-4 leading-relaxed">
        Based on your highest emission category, here are the most impactful actions you can take right now:
      </p>

      <div className="space-y-3">
        {recommendations.map((rec, i) => {
          const saving = SAVING_ESTIMATES[rec];
          return (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-eco-900 hover:bg-opacity-20 cursor-pointer"
              style={{ border: '1px solid rgba(34,197,94,0.08)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: CATEGORY_COLORS[topCategory] + '30', color: CATEGORY_COLORS[topCategory] }}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-200 text-sm leading-relaxed">{rec}</p>
                {saving && (
                  <span className="badge badge-eco text-xs mt-1">{saving}</span>
                )}
              </div>
              <span className="text-lg">{CATEGORY_ICONS[topCategory]}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-eco-900 border-opacity-20">
        <p className="text-xs text-gray-500">
          🤖 Want AI-powered personalized tips?{' '}
          <a href="/dashboard/insights" className="text-eco-400 hover:text-eco-300 transition-colors">
            Visit AI Insights →
          </a>
        </p>
      </div>
    </div>
  );
}
