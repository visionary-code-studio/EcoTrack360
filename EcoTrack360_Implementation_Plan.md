# EcoTrack360 — Implementation Plan

## Objective

Build a clean, functional MVP of EcoTrack360.  
The goal is not full feature completeness. The goal is to deliver a working, presentable prototype with:

- landing page,
- dashboard,
- activity logging,
- carbon calculation,
- recommendation cards,
- simple charts,
- responsive UI.

---

## 1. Priority Definition

### Must Have
- Home / landing page
- Main dashboard
- Activity logging form
- Carbon score calculation
- Category-wise result summary
- Recommendation section
- Responsive layout

### Should Have
- Trend chart
- Goal/progress card
- Small achievement badge
- Reset or sample data option

### Nice to Have
- Login page mock
- Weekly report card
- Dark mode toggle
- Animated transitions

---

## 2. Recommended Stack for Speed

Use the fastest stack possible for a hackathon-style build:

- **Next.js**
- **Tailwind CSS**
- **TypeScript**
- **Recharts**
- **Lucide React**
- Optional simple state with **React hooks**

Why this stack:
- fast to scaffold,
- fast to style,
- easy to deploy,
- good for dashboard UI,
- easy to demonstrate in a short time.

---

## 3. Build Strategy

The best approach is to avoid overengineering.

### Core approach:
- hardcode a small emission factor dataset,
- calculate carbon footprint locally in the frontend,
- keep the first version mostly UI-driven,
- use reusable cards and sections,
- simulate personalized recommendations from calculation rules.

This allows a polished demo even without a heavy backend.

---

## 4. Implementation Breakdown

## Phase 1 — Project Setup (10 minutes)
Tasks:
- create the Next.js app,
- install Tailwind and chart dependencies,
- set up base folder structure,
- create a simple theme and layout.

Suggested folders:
- `app/`
- `components/`
- `lib/`
- `data/`

---

## Phase 2 — Static Data + Carbon Logic (15 minutes)
Tasks:
- create a small emission factor dataset,
- add categories such as:
  - transport,
  - electricity,
  - food,
  - waste,
  - shopping,
- create a simple function to compute total CO₂e,
- create helper functions to rank categories.

Example logic:
- transport = distance × factor
- electricity = units × factor
- food = meal type factor × servings
- waste = waste amount × factor
- shopping = item count × factor

Deliverable:
- a `calculateFootprint()` utility,
- a `getRecommendations()` utility.

---

## Phase 3 — UI Shell (20 minutes)
Tasks:
- build the header,
- add hero section,
- add dashboard cards,
- create a consistent card design,
- place summary metrics on top.

Suggested sections:
- Total footprint card
- Biggest emission source card
- Weekly change card
- Reduction opportunity card

Deliverable:
- a visually complete screen,
- all major sections visible without interaction.

---

## Phase 4 — Activity Input Form (15 minutes)
Tasks:
- build a form for daily activity entry,
- allow category selection,
- allow quantity input,
- calculate footprint on submit,
- show instant result in UI.

Inputs:
- category
- activity type
- quantity
- unit
- notes optional

Deliverable:
- user can simulate footprint logging.

---

## Phase 5 — Recommendation Logic (10 minutes)
Tasks:
- based on highest emission category, generate tips,
- show 3–5 personalized recommendations,
- keep suggestions short and action-oriented.

Example:
- reduce car travel by 2 days/week,
- switch 1 meal to plant-based,
- turn off unused appliances,
- use LED lighting,
- avoid unnecessary purchases.

Deliverable:
- recommendation panel with meaningful suggestions.

---

## Phase 6 — Chart + Progress Views (10 minutes)
Tasks:
- add one pie chart or bar chart,
- show category breakdown,
- add a progress bar for goal completion,
- add a small weekly trend line if time allows.

Deliverable:
- dashboard feels data-rich and more convincing.

---

## Phase 7 — Polish and Responsiveness (10 minutes)
Tasks:
- improve spacing,
- refine typography,
- ensure mobile responsiveness,
- check card alignment,
- add hover states and subtle motion.

Deliverable:
- presentation-ready UI.

---

## Phase 8 — Final Testing and Demo Prep (10 minutes)
Tasks:
- test calculation flow,
- test recommendation generation,
- verify charts render,
- check mobile layout,
- prepare demo scenario and sample inputs.

Deliverable:
- stable demo walkthrough.

---

## 5. Suggested Folder Structure

```bash
app/
  page.tsx
  globals.css

components/
  Header.tsx
  Hero.tsx
  StatCard.tsx
  ActivityForm.tsx
  RecommendationList.tsx
  FootprintChart.tsx
  GoalCard.tsx

lib/
  carbon.ts
  recommendations.ts

data/
  emissionFactors.ts
  sampleActivities.ts
```

---

## 6. Data Model for MVP

### Sample Activity Object
```ts
{
  category: "transport",
  type: "car",
  quantity: 12,
  unit: "km",
  co2e: 2.4
}
```

### Sample User Summary
```ts
{
  totalFootprint: 18.2,
  topCategory: "transport",
  weeklyChange: -8,
  goalProgress: 64
}
```

---

## 7. Minimal Calculation Rules

Use a small set of default emission factors.

Example logic:
- Car travel produces more emissions than walking or cycling.
- Meat-based meals produce more emissions than plant-based meals.
- Electricity usage scales with units consumed.
- Waste and shopping create smaller but still visible contributions.

This is enough for a strong MVP demo.

---

## 8. UI Sections to Build First

### Section 1: Hero
- title
- subtitle
- CTA
- carbon summary preview

### Section 2: Activity Input
- form with quick fields
- calculate button
- instant feedback

### Section 3: Dashboard Metrics
- total footprint
- top category
- weekly change
- sustainability score

### Section 4: Recommendations
- 3–5 actionable tips
- benefit estimate labels

### Section 5: Chart
- category bar chart or donut chart

### Section 6: Goal Progress
- progress bar
- badge
- short message

---

## 9. Demo Flow

For presentation, the demo should look like this:

1. Open landing page.
2. Show how the platform explains carbon footprint.
3. Enter a sample activity.
4. Show the calculated CO₂ impact.
5. Highlight the largest emission source.
6. Show personalized recommendations.
7. Display chart and progress card.
8. Conclude with sustainability motivation.

This creates a smooth story even with a small codebase.

---

## 10. Risk Control

### Risk: Not enough time
Mitigation:
- avoid backend integration,
- keep state local,
- hardcode sample data.

### Risk: UI not polished
Mitigation:
- use consistent card layout,
- reuse one design system,
- focus on spacing and hierarchy.

### Risk: Carbon logic too complex
Mitigation:
- use a simple rules engine,
- keep formulas transparent,
- avoid overfitting.

---

## 11. Final Deliverable Checklist

Before submission, ensure the MVP has:

- a working dashboard,
- footprint calculation,
- visible category breakdown,
- recommendation section,
- responsive layout,
- basic styling consistency,
- clean project structure,
- understandable demo flow.

---

## 12. Submission Priority Order

If time becomes tight, finish in this order:

1. UI shell
2. Activity form
3. Carbon calculation logic
4. Recommendations
5. Chart
6. Progress card
7. Polish

---

