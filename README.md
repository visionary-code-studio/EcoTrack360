# 🌿 EcoTrack360

> **Measure. Understand. Reduce. Sustain.**

EcoTrack360 is a premium, data-driven carbon footprint tracking and intelligence platform. It turns abstract climate impact into simple, actionable daily logs, personalized coaching, and visual progress metrics, helping individuals build long-term sustainable habits.

---

## 🚀 Unique Selling Proposition (USP)

- **AI-Powered Contextual Coaching**: Get real-time advice from the **EcoAI Coach** powered by Groq and Llama 3.3, which dynamically reads your actual activity logs to give personalized suggestions.
- **Zero-Friction Demo Mode**: Bypasses Firebase Auth restrictions (such as dynamic Vercel staging domains or localhost domain whitelisting) using a one-click local guest session fallback.
- **Micro-Habit Gamification**: An interactive **Eco Score** (0-100) dynamically recalculated on daily logs, encouraging users to stay under carbon budgets.
- **Glassmorphic Eco-Dark Theme**: A visually stunning, fluid user interface utilizing neon green/blue radial glows, responsive transitions, and premium interactive charts.

---

## 📋 Product Requirements Document (PRD)

### Product Goals
1. **Estimate**: Quickly log and calculate daily carbon emissions (in kg CO₂e).
2. **Visualize**: Highlight highest emission categories (Transport, Food, Electricity, Waste, Shopping) via interactive charts.
3. **Recommend**: Deliver personalized action items to reduce emissions.
4. **Motivate**: Keep users engaged with progress bars, streaks, and target goals.

### User Persona Focus
- **Primary**: Carbon-conscious individuals, urban commuters, students, and families tracking sustainability.
- **Secondary**: ESG teams, community-led environmental groups, and corporate wellness initiatives.

---

## 🛠️ Technical Stack

- **Core Framework**: [Next.js 14](https://nextjs.org/) (App Router, dynamic API routes)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Design & Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom dark theme, glassmorphism, and responsive layouts
- **Icons & Graphics**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Analytics & Graphs**: [Recharts](https://recharts.org/) (Responsive Area, Bar, and Pie charts)
- **Database & Storage**: [Firebase Firestore](https://firebase.google.com/docs/firestore) (with client-side `localStorage` data sync fallback)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) (Google OAuth & Email/Password) + **Local Demo Session Bypass**
- **AI Engine**: [Groq SDK](https://github.com/groq/groq-typescript) (Llama-3.3-70b-versatile model)

---

## ✨ Features & Capabilities

1. **Interactive Dashboard**: Real-time stats on total carbon footprint, monthly budget status, and a breakdown chart of your top emission categories.
2. **Activity Logging**: Simplified logging interface for `Transport`, `Food`, `Electricity`, `Waste`, and `Shopping` categories with automatic emission coefficient translation.
3. **EcoAI Insights (Chatbot)**: A dedicated AI chat workspace to ask context-aware questions. The assistant has access to your live carbon scores and helps design concrete reduction plans.
4. **Target Goals**: Dynamically update your monthly carbon budget and watch your progress bars recalculate instantly.
5. **Detailed Reports**: Visual breakdowns comparing weekly patterns, highlighting areas of success, and tracking overall trends.

---

## 🎨 UI & Design Principles

The application is crafted to deliver a modern, premium experience:
- **Neon Glow Aesthetics**: Ambient green and blue radial lights reflect eco-sustainability and modern technology.
- **Fluid Layouts**: Features a collapsable desktop sidebar and mobile-friendly bottom navigations.
- **Typography**: Sleek Sans-Serif system fonts styled dynamically using tailwind layouts.
- **Micro-Animations**: Hover-triggered translations and pulsing visual rings on interactive buttons.

---

## 📈 User Insights & Calculations

EcoTrack360 calculates carbon emissions utilizing standard EPA and carbon offset constants:
- **Transport**: Petrol vehicles run at `0.192 kg CO₂e / km` vs Bus/Train which ranges between `0.04 - 0.089 kg CO₂e / km`.
- **Food**: Beef diet contributes `6.61 kg CO₂e / portion` compared to a plant-based portion at `0.72 kg CO₂e`.
- **Electricity**: Standard grid consumption translates at `0.233 kg CO₂e / kWh`.

### The Eco Score
The platform generates an **Eco Score** out of 100 based on your logged footprint relative to the monthly budget goal:
- **70+**: 🌿 *Excellent!*
- **40-69**: 🌱 *Keep going!*
- **Under 40**: ⚡ *Time to take action!*

---

## ⚙️ How to Run Locally

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY="your-groq-api-key"
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Build and Run the App
- **Development Server**:
  ```bash
  npm run dev
  ```
- **Production Server**:
  ```bash
  npm run build
  npm run start
  ```

Open [http://localhost:3000](http://localhost:3000) in your browser. If you do not have Firebase configured, click **⚡ Continue in Demo Mode (Bypass Auth)** to run the application immediately.
