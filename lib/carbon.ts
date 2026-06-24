// lib/carbon.ts
// Carbon emission factors (kg CO₂e per unit)
// Sources: EPA, DEFRA, IPCC emission factor databases

export type Category = 'transport' | 'electricity' | 'food' | 'waste' | 'shopping';

export interface EmissionFactor {
  label: string;
  unit: string;
  factor: number; // kg CO₂e per unit
  icon: string;
}

export interface ActivityEntry {
  id: string;
  category: Category;
  type: string;
  quantity: number;
  co2e: number;
  date: string;
  notes?: string;
}

export interface FootprintSummary {
  total: number;
  byCategory: Record<Category, number>;
  topCategory: Category;
  weeklyChange: number;
  goalProgress: number;
  ecoScore: number;
}

// Emission factors per category
export const EMISSION_FACTORS: Record<Category, Record<string, EmissionFactor>> = {
  transport: {
    car_petrol:   { label: 'Car (Petrol)',   unit: 'km', factor: 0.192, icon: '🚗' },
    car_diesel:   { label: 'Car (Diesel)',   unit: 'km', factor: 0.171, icon: '🚙' },
    car_electric: { label: 'Car (Electric)', unit: 'km', factor: 0.053, icon: '⚡' },
    bus:          { label: 'Bus',            unit: 'km', factor: 0.089, icon: '🚌' },
    train:        { label: 'Train',          unit: 'km', factor: 0.041, icon: '🚆' },
    flight_short: { label: 'Flight (<3h)',   unit: 'km', factor: 0.255, icon: '✈️' },
    flight_long:  { label: 'Flight (>3h)',   unit: 'km', factor: 0.195, icon: '🛫' },
    motorcycle:   { label: 'Motorcycle',     unit: 'km', factor: 0.114, icon: '🏍️' },
    bicycle:      { label: 'Bicycle/Walk',   unit: 'km', factor: 0.000, icon: '🚲' },
  },
  electricity: {
    grid:         { label: 'Grid Electricity',  unit: 'kWh', factor: 0.233, icon: '💡' },
    solar:        { label: 'Solar Power',        unit: 'kWh', factor: 0.048, icon: '☀️' },
    green_tariff: { label: 'Green Tariff',       unit: 'kWh', factor: 0.050, icon: '🌿' },
  },
  food: {
    beef:         { label: 'Beef Meal',          unit: 'serving', factor: 6.61,  icon: '🥩' },
    pork:         { label: 'Pork Meal',          unit: 'serving', factor: 3.51,  icon: '🍖' },
    chicken:      { label: 'Chicken Meal',       unit: 'serving', factor: 1.72,  icon: '🍗' },
    fish:         { label: 'Fish/Seafood',       unit: 'serving', factor: 1.96,  icon: '🐟' },
    dairy:        { label: 'Dairy-heavy Meal',   unit: 'serving', factor: 2.45,  icon: '🧀' },
    vegetarian:   { label: 'Vegetarian Meal',    unit: 'serving', factor: 0.72,  icon: '🥗' },
    vegan:        { label: 'Vegan Meal',         unit: 'serving', factor: 0.45,  icon: '🥦' },
  },
  waste: {
    landfill:     { label: 'Landfill Waste',     unit: 'kg',      factor: 0.57,  icon: '🗑️' },
    recycling:    { label: 'Recycling',          unit: 'kg',      factor: 0.021, icon: '♻️' },
    organic:      { label: 'Composting',         unit: 'kg',      factor: 0.064, icon: '🌱' },
  },
  shopping: {
    clothing:     { label: 'Clothing Item',      unit: 'item',    factor: 20.0,  icon: '👕' },
    electronics:  { label: 'Electronics',        unit: 'item',    factor: 70.0,  icon: '📱' },
    furniture:    { label: 'Furniture',          unit: 'item',    factor: 45.0,  icon: '🪑' },
    general:      { label: 'General Purchase',   unit: 'item',    factor: 5.0,   icon: '🛍️' },
  },
};

// Monthly carbon budget target (kg CO₂e) — average person 800kg/month, target 400kg
export const MONTHLY_BUDGET = 400;

export function calculateCO2e(category: Category, type: string, quantity: number): number {
  const factor = EMISSION_FACTORS[category]?.[type]?.factor ?? 0;
  return parseFloat((factor * quantity).toFixed(3));
}

export function summarizeActivities(activities: ActivityEntry[], goal: number = MONTHLY_BUDGET): FootprintSummary {
  const byCategory: Record<Category, number> = {
    transport: 0,
    electricity: 0,
    food: 0,
    waste: 0,
    shopping: 0,
  };

  let total = 0;
  for (const a of activities) {
    byCategory[a.category] = (byCategory[a.category] || 0) + a.co2e;
    total += a.co2e;
  }

  const topCategory = (Object.entries(byCategory) as [Category, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'transport';

  const goalProgress = Math.min(100, Math.round((1 - total / goal) * 100));
  const ecoScore = Math.max(0, Math.min(100, Math.round(100 - (total / goal) * 50)));

  return {
    total: parseFloat(total.toFixed(2)),
    byCategory,
    topCategory,
    weeklyChange: 0,
    goalProgress,
    ecoScore,
  };
}

export function getRecommendations(topCategory: Category): string[] {
  const tips: Record<Category, string[]> = {
    transport: [
      'Switch 2 car trips/week to public transit — saves ~8 kg CO₂e',
      'Carpool to work or school to halve your commute emissions',
      'Consider an EV or hybrid for your next vehicle',
      'Combine errands into a single trip to cut idle mileage',
      'Work from home 1 extra day per week to eliminate commute',
    ],
    electricity: [
      'Switch to LED bulbs throughout your home — saves ~0.45 kg/day',
      'Set your thermostat 2°C lower in winter, higher in summer',
      'Unplug standby appliances — they consume 10% of home energy',
      'Wash clothes at 30°C instead of 60°C',
      'Consider a green energy tariff or rooftop solar panels',
    ],
    food: [
      'Replace 1 beef meal/week with chicken — saves ~5 kg CO₂e',
      'Try 1 plant-based day per week to cut food emissions by ~14%',
      'Buy local and seasonal produce to reduce transport emissions',
      'Reduce food waste by planning meals — wasted food = wasted emissions',
      'Choose sustainable seafood options over farmed salmon or shrimp',
    ],
    waste: [
      'Start composting food scraps to divert organic waste from landfill',
      'Set up a recycling system at home for paper, plastic, and metal',
      'Buy products with less packaging or choose refillable options',
      'Donate or resell items instead of disposing of them',
      'Repair electronics and clothing rather than replacing them',
    ],
    shopping: [
      'Buy second-hand clothing instead of new — saves 70% of emissions',
      'Choose quality over quantity to reduce frequency of purchases',
      'Research product life-cycle impact before buying electronics',
      'Rent or borrow rarely used items instead of purchasing',
      'Support brands with verified sustainability certifications',
    ],
  };
  return tips[topCategory] ?? tips.transport;
}

export const BADGE_THRESHOLDS = [
  { id: 'seedling',   label: 'Seedling',      desc: 'Logged first activity',    icon: '🌱', condition: (n: number) => n >= 1   },
  { id: 'leaf',       label: 'Green Leaf',    desc: 'Logged 5 activities',       icon: '🍃', condition: (n: number) => n >= 5   },
  { id: 'tree',       label: 'Tree Planter',  desc: 'Logged 10 activities',      icon: '🌳', condition: (n: number) => n >= 10  },
  { id: 'globe',      label: 'Eco Champion',  desc: 'Reached 50% goal progress', icon: '🌍', condition: (n: number) => n >= 20  },
  { id: 'lightning',  label: 'Spark of Change',desc: 'Logged 30 activities',    icon: '⚡', condition: (n: number) => n >= 30  },
];
