# EcoTrack360 — Product Requirements & System Design

## 1. Project Overview

**Idea Name:** EcoTrack360  
**Tagline:** Measure. Understand. Reduce. Sustain.

EcoTrack360 is a carbon footprint awareness platform that helps individuals understand how their daily choices affect the environment and gives them practical, personalized ways to reduce emissions. The product is designed to turn abstract climate impact into simple, measurable, and motivating actions.

The platform focuses on four user goals:

1. Understand personal carbon emissions.
2. Track emissions across daily life categories.
3. Receive personalized reduction suggestions.
4. Build sustainable habits through progress tracking and lightweight gamification.

---

## 2. Problem Statement

Most individuals do not have a clear view of their personal carbon footprint. They may know that transportation, electricity usage, food choices, and consumption habits contribute to emissions, but they do not know which actions matter most or how to reduce their footprint in realistic ways.

Existing sustainability tools often suffer from one or more of the following issues:

- They are too technical or difficult to use.
- They present data without meaningful guidance.
- They do not adapt recommendations to the user’s lifestyle.
- They fail to keep users engaged long enough to form habits.

As a result, people remain aware of climate issues but lack the tools and motivation to make measurable improvements.

---

## 3. Product Goals

EcoTrack360 should help users:

- estimate their daily, weekly, and monthly carbon footprint,
- identify the biggest sources of emissions,
- receive clear and personalized reduction tips,
- compare progress over time,
- stay motivated with goals, streaks, and badges,
- understand how small changes create environmental impact.

---

## 4. Target Users

### Primary Users
- Students
- Office workers
- Urban commuters
- Environment-conscious individuals
- Families tracking household sustainability

### Secondary Users
- NGOs and sustainability communities
- Educational institutions
- Corporate wellness or ESG teams

---

## 5. Scope

## 5.1 MVP Scope

The minimum viable product should include:

- user authentication,
- user profile setup,
- carbon activity logging,
- footprint calculation,
- dashboard with category breakdown,
- personalized recommendations,
- goal setting,
- trend chart,
- basic achievements/badges,
- weekly summary view.

## 5.2 Future Scope

Possible post-MVP enhancements:

- AI-based lifestyle coaching,
- monthly sustainability report generation,
- community challenges,
- smart reminders,
- integrations with transport or utility sources,
- household-level tracking,
- leaderboard and team challenges,
- location-based green suggestions,
- bill upload or OCR-based energy estimation,
- multilingual interface.

---

## 6. Functional Requirements

### 6.1 Authentication
- Users can sign up and log in using email/password or Google OAuth.
- Users can securely log out and manage their profile.

### 6.2 Profile Setup
- Users can enter basic details such as age group, city, lifestyle type, and household size.
- Users can select a goal, such as “reduce transport emissions” or “reduce electricity usage.”

### 6.3 Activity Logging
- Users can log activities from key categories:
  - transport,
  - electricity,
  - food,
  - waste,
  - shopping/consumption.
- Each activity record should include date, category, quantity, and optional notes.

### 6.4 Footprint Calculation
- The system should convert activities into CO₂ equivalent values using emission factors.
- The platform should calculate totals per activity, per category, and overall footprint.

### 6.5 Dashboard
- Users can view total emissions for the selected time period.
- Users can see emission breakdown by category.
- Users can compare current footprint against previous periods.

### 6.6 Recommendations
- The system should suggest practical actions based on the user’s largest emission sources.
- Suggestions should be ranked by expected impact and ease of adoption.

### 6.7 Goal Tracking
- Users can set emission reduction targets.
- The system should show goal completion progress and streaks.

### 6.8 Reports
- Users can view weekly and monthly summaries.
- The system can generate simple insights such as “transport emissions increased by 14% this week.”

---

## 7. Non-Functional Requirements

### 7.1 Usability
- Interface should be simple enough for first-time users.
- Key actions should be reachable within 2–3 clicks.

### 7.2 Performance
- Dashboard should load quickly.
- Activity logging should feel instant and lightweight.

### 7.3 Scalability
- The architecture should support more users and more activity categories later.

### 7.4 Security
- Authentication should be secure.
- User data should be stored with access controls.
- Personal data should be minimized and protected.

### 7.5 Maintainability
- Core logic should be modular.
- Emission factors should be easy to update.

### 7.6 Accessibility
- High contrast text and responsive layouts.
- Clear labels, icons, and readable charts.

---

## 8. Technical Stack

## 8.1 Frontend
Recommended stack:
- **React.js** or **Next.js**
- **Tailwind CSS**
- **TypeScript**
- **Recharts** or **Chart.js** for graphs
- **Framer Motion** for subtle animation
- **Lucide React** for icons

Why:
- Fast UI development
- Responsive and component-based structure
- Easy dashboard and chart implementation

## 8.2 Backend
Recommended stack:
- **Node.js + Express**
- Optional alternative: **FastAPI**

Why:
- Simple API design
- Fast integration with frontend
- Straightforward handling of calculation and recommendation endpoints

## 8.3 Database
Recommended stack:
- **Firebase Firestore** for rapid development
- Optional alternative: **PostgreSQL**

Why:
- Firestore is quick to set up for hackathon-grade delivery
- PostgreSQL is better for richer analytics and relational reporting

## 8.4 Authentication
- **Firebase Authentication**
- Google OAuth
- Email/password login

## 8.5 AI / Recommendation Layer
- Rule-based emission recommendation engine for deterministic suggestions
- Optional generative layer using **Gemini API** or **OpenAI API** for personalized explanations

## 8.6 Analytics and Reporting
- **Pandas** for data aggregation
- **Plotly** or **Recharts** for visual summaries
- Optional product analytics: **PostHog**

## 8.7 Deployment
- **Vercel** for frontend
- **Render**, **Railway**, or **Cloud Run** for backend
- **Firebase Hosting** as an alternative all-in-one option

---

## 9. System Architecture

## 9.1 Architecture Style
A modular three-layer architecture works best:

1. **Presentation Layer** — UI and user interaction
2. **Application Layer** — business logic, calculations, recommendations
3. **Data Layer** — storage and persistence

## 9.2 Main Components

### A. Client / Frontend
Handles:
- login and signup screens,
- dashboard rendering,
- activity submission forms,
- charts and reports,
- goal management,
- recommendation cards.

### B. API Layer / Backend Server
Handles:
- authentication validation,
- request handling,
- emission calculations,
- data aggregation,
- recommendation generation,
- report preparation.

### C. Carbon Calculation Engine
A core service that:
- converts user activity into emissions,
- applies emission factors,
- calculates category totals,
- stores computed values.

### D. Recommendation Engine
A logic layer that:
- identifies high-impact user behaviors,
- prioritizes actions with the highest reduction potential,
- converts environmental data into plain-language suggestions.

### E. Database
Stores:
- user profiles,
- activity logs,
- footprint summaries,
- goals,
- achievements,
- reports,
- recommendation history.

---

## 10. Data Model

## 10.1 Users
Fields:
- user_id
- name
- email
- lifestyle_type
- city
- household_size
- created_at

## 10.2 Activity Logs
Fields:
- activity_id
- user_id
- category
- subcategory
- quantity
- unit
- co2e
- notes
- date_created

## 10.3 Goals
Fields:
- goal_id
- user_id
- target_type
- target_value
- timeframe
- progress
- status

## 10.4 Recommendations
Fields:
- recommendation_id
- user_id
- title
- description
- expected_savings
- category
- created_at

## 10.5 Reports
Fields:
- report_id
- user_id
- period_start
- period_end
- total_emissions
- category_breakdown
- insights

---

## 11. System Workflow

## 11.1 Onboarding Flow
1. User opens the platform.
2. User signs up or logs in.
3. User fills profile details.
4. System initializes a baseline sustainability profile.
5. User lands on the dashboard.

## 11.2 Activity Logging Flow
1. User chooses an emission category.
2. User enters activity quantity.
3. System validates the input.
4. Carbon engine converts input to CO₂e.
5. Record is saved in the database.
6. Dashboard updates totals and charts.

## 11.3 Insight Generation Flow
1. System reviews the latest activity data.
2. It identifies the highest-emission categories.
3. Recommendations are ranked by impact.
4. User sees short, actionable guidance.

## 11.4 Goal Tracking Flow
1. User sets a reduction target.
2. System compares current emissions to the target.
3. Progress bar and streak values update.
4. Milestones unlock badges or achievement states.

## 11.5 Reporting Flow
1. System aggregates activity over a defined period.
2. It calculates category-wise totals and deltas.
3. A report card or summary view is generated.
4. User can review trends and progress.

---

## 12. UI & System Design

## 12.1 UI Principles
- clean,
- minimal,
- eco-friendly,
- data-first,
- mobile responsive,
- simple enough for non-technical users.

## 12.2 Color and Visual Theme
Recommended theme:
- green for sustainability,
- blue for trust and clarity,
- neutral backgrounds,
- soft shadows and rounded cards.

## 12.3 Main Screens

### Landing Page
- title banner,
- short value proposition,
- CTA button,
- example carbon score preview,
- section explaining how it works.

### Signup/Login Page
- simple login form,
- Google sign-in button,
- clear onboarding prompt.

### Dashboard
- total carbon footprint card,
- emission breakdown chart,
- progress bar,
- recommendation highlights,
- recent activity panel.

### Activity Logger
- category dropdown,
- quantity input,
- save button,
- quick-select chips for common actions.

### Insights Page
- personalized recommendations,
- emission-saving estimates,
- “why this matters” explanation.

### Goals Page
- monthly target input,
- progress meter,
- achievement badges,
- streak indicator.

### Reports Page
- weekly and monthly charts,
- trend comparison,
- summary cards.

## 12.4 Layout Structure
Suggested layout:
- top navigation bar,
- left sidebar for desktop,
- bottom tab navigation for mobile,
- content cards in a grid,
- charts placed above detailed tables.

---

## 13. UX Flow Summary

The user journey should feel like this:

1. Sign up in seconds.
2. Enter a few lifestyle details.
3. Log daily activities quickly.
4. View immediate carbon impact.
5. Receive helpful reduction suggestions.
6. Track progress over time.
7. Stay motivated through goals and badges.

The entire experience should minimize friction and maximize clarity.

---

## 14. Key Differentiators

EcoTrack360 stands out because it:

- translates carbon data into actionable guidance,
- adapts recommendations to lifestyle patterns,
- combines tracking with motivation,
- keeps the interface simple,
- can be built as a polished MVP quickly.

---

## 15. Conclusion

EcoTrack360 is a practical carbon footprint awareness platform designed to help individuals understand their environmental impact and reduce emissions through everyday actions. The solution is intentionally simple for MVP delivery but structured in a way that can scale into a richer sustainability intelligence platform later.

