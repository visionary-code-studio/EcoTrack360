'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const STATS = [
  { value: '18.2', unit: 'kg', label: 'Avg daily CO₂e', icon: '🌍' },
  { value: '64%', unit: '', label: 'Goal achieved', icon: '🎯' },
  { value: '-8%', unit: '', label: 'Weekly improvement', icon: '📈' },
  { value: '850+', unit: '', label: 'Active users', icon: '👥' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '📝',
    title: 'Log Your Activities',
    desc: 'Quickly record transport, food, electricity, waste, and shopping through our intuitive activity logger.',
    color: '#22c55e',
    highlight: 'Daily logging',
  },
  {
    step: '02',
    icon: '📊',
    title: 'Calculate Your Impact',
    desc: 'Our carbon engine instantly converts your activities into kg CO₂e using verified EPA & DEFRA emission factors.',
    color: '#0ea5e9',
    highlight: 'Real-time calc',
  },
  {
    step: '03',
    icon: '🤖',
    title: 'Get AI Recommendations',
    desc: 'Receive personalized, actionable tips powered by Groq AI to reduce your biggest emission sources first.',
    color: '#4ade80',
    highlight: 'AI-powered',
  },
];

const FEATURES = [
  { icon: '🌿', title: 'Carbon Calculator', desc: '5 emission categories with verified EPA & DEFRA factors', badge: 'Core' },
  { icon: '📈', title: 'Visual Dashboard', desc: 'Real-time charts, trend analysis, and category breakdown', badge: 'Analytics' },
  { icon: '🤖', title: 'Groq AI Coach', desc: 'Personalized recommendations powered by LLaMA 3.3 AI', badge: 'AI' },
  { icon: '🎯', title: 'Goal Tracking', desc: 'Set reduction targets and monitor progress with streaks', badge: 'Goals' },
  { icon: '🏆', title: 'Achievement Badges', desc: 'Earn badges as you log activities and hit milestones', badge: 'Rewards' },
  { icon: '📱', title: 'Fully Responsive', desc: 'Works beautifully on desktop, tablet, and mobile devices', badge: 'Mobile' },
];

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    const handleScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll); };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-900">

      {/* ── VIDEO HERO ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="/Landing_Page_Splash.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div className="video-overlay absolute inset-0" style={{ zIndex: 1 }} />

        {/* Radial glow bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            zIndex: 2,
            background: 'radial-gradient(ellipse at center bottom, rgba(34,197,94,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                background: i % 4 === 0 ? '#22c55e' : i % 4 === 1 ? '#0ea5e9' : i % 4 === 2 ? '#4ade80' : '#86efac',
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 18 + 8}s`,
                animationDelay: `${Math.random() * 12}s`,
                opacity: 0.5,
              }}
            />
          ))}
        </div>

        {/* Navbar */}
        <nav
          className={`fixed top-0 left-0 right-0 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500`}
          style={{
            zIndex: 50,
            background: navScrolled ? 'rgba(10,15,10,0.92)' : 'transparent',
            backdropFilter: navScrolled ? 'blur(20px)' : 'none',
            borderBottom: navScrolled ? '1px solid rgba(34,197,94,0.12)' : 'none',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-eco-500 opacity-20 blur-md" />
              <Image src="/Logo.png" alt="EcoTrack360 Logo" width={40} height={40} className="relative rounded-xl" />
            </div>
            <div>
              <div className="text-white font-black text-lg leading-tight tracking-tight">EcoTrack360</div>
              <div className="text-eco-500 text-[10px] font-medium leading-tight hidden sm:block">Carbon Intelligence</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-gray-300 hover:text-eco-400 transition-colors text-sm font-medium">How it Works</a>
            <a href="#features" className="text-gray-300 hover:text-eco-400 transition-colors text-sm font-medium">Features</a>
            <a href="#mission" className="text-gray-300 hover:text-eco-400 transition-colors text-sm font-medium">Mission</a>
            <Link href="/dashboard" className="eco-btn text-sm py-2.5 px-5">
              Open Dashboard →
            </Link>
          </div>
          <Link href="/dashboard" className="md:hidden eco-btn text-sm py-2 px-4">
            Dashboard
          </Link>
        </nav>

        {/* Hero content */}
        <div
          className={`relative text-center px-4 max-w-5xl mx-auto transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ zIndex: 5 }}
        >
          <div className="badge badge-eco mb-6 mx-auto text-sm px-4 py-1.5">
            🌍 AI-Powered Carbon Intelligence Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
            Measure Your Impact.{' '}
            <br className="hidden md:block" />
            <span className="hero-shimmer">Save the Planet.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-3 leading-relaxed">
            EcoTrack360 turns your daily habits into actionable climate intelligence.
          </p>
          <p className="text-sm text-gray-400 max-w-xl mx-auto mb-10 italic">
            Measure. Understand. Reduce. Sustain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/dashboard" className="eco-btn text-base px-9 py-4 eco-glow">
              🚀 Start Tracking Free
            </Link>
            <a href="#how-it-works" className="eco-btn-outline text-base px-8 py-4">
              Learn How It Works →
            </a>
          </div>

          {/* Floating stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="glass-card p-4 text-center float-animate"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <div className="text-xl mb-1">{s.icon}</div>
                <div className={`text-2xl font-black ${i % 2 === 0 ? 'eco-gradient-text' : 'ocean-gradient-text'} stat-number`}>
                  {s.value}<span className="text-sm ml-0.5">{s.unit}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ zIndex: 5 }}>
          <div className="animate-bounce flex flex-col items-center gap-1.5">
            <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
            <div className="w-5 h-8 border-2 border-gray-500 rounded-full flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-eco-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900" />
        {/* Decorative glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge badge-eco mb-4 mx-auto text-sm px-4">How It Works</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Simple Steps to a{' '}
              <span className="eco-gradient-text">Greener You</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
              From logging your first activity to building lasting sustainable habits — EcoTrack360 guides every step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="glass-card glass-card-hover p-8 relative overflow-hidden group">
                {/* Big step number BG */}
                <div
                  className="absolute -top-4 -right-4 text-[110px] font-black opacity-[0.06] select-none pointer-events-none transition-all duration-500 group-hover:opacity-[0.1]"
                  style={{ color: item.color, lineHeight: 1 }}
                >
                  {item.step}
                </div>
                {/* Accent bar */}
                <div className="w-12 h-1 rounded-full mb-5 transition-all duration-500 group-hover:w-20" style={{ background: item.color }} />
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: item.color }}>
                  Step {item.step} · {item.highlight}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA after steps */}
          <div className="text-center mt-12">
            <Link href="/dashboard/log" className="eco-btn text-sm px-6 py-3">
              ➕ Start Logging Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-4 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0f0a 0%, #0c1a14 50%, #0a0f0a 100%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge badge-ocean mb-4 mx-auto text-sm px-4">Platform Features</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">
              Everything You Need to{' '}
              <span className="ocean-gradient-text">Act on Climate</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Built for real people who want to make a real difference, with zero complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card glass-card-hover p-6 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-eco-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{f.icon}</div>
                  <span className="badge badge-eco text-[10px] px-2 py-0.5">{f.badge}</span>
                </div>
                <h3 className="text-white font-bold mb-2 text-base">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION / CTA ── */}
      <section id="mission" className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, rgba(10,15,10,0.98) 65%)' }} />
        <div className="absolute inset-0 bg-surface-900 opacity-70" />

        {/* Large globe emoji BG */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[500px] opacity-[0.03] select-none pointer-events-none" style={{ color: '#22c55e', lineHeight: 1 }}>🌍</div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="badge badge-eco mb-6 mx-auto text-sm px-4">Our Mission</div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Every Action Counts.
            <br />
            <span className="hero-shimmer">Start Counting Yours.</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
            Climate change is the defining challenge of our generation. EcoTrack360 believes that
            awareness is the first step to action.
          </p>
          <p className="text-gray-400 text-base leading-relaxed mb-12 max-w-xl mx-auto">
            By making your personal carbon footprint visible, measurable, and manageable —
            we empower you to be part of the solution, starting today.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
            {[
              { value: '4.8T', label: 'tonnes CO₂ saved globally', icon: '🌱' },
              { value: '195', label: 'countries tracking', icon: '🗺️' },
              { value: '2030', label: 'net-zero target year', icon: '🎯' },
            ].map((s, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-xl font-black eco-gradient-text">{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="eco-btn text-base px-10 py-4 eco-glow">
              🌱 Begin Your Journey
            </Link>
            <Link href="/dashboard/insights" className="eco-btn-outline text-base px-8 py-4">
              🤖 Ask AI Coach
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-surface-900 border-t py-12 px-4" style={{ borderColor: 'rgba(34,197,94,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Image src="/Logo.png" alt="EcoTrack360" width={36} height={36} className="rounded-xl opacity-90" />
              <div>
                <div className="text-white font-bold">EcoTrack360</div>
                <div className="text-gray-500 text-xs">Measure. Understand. Reduce. Sustain.</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#how-it-works" className="text-gray-500 hover:text-eco-400 transition-colors text-sm">How It Works</a>
              <a href="#features" className="text-gray-500 hover:text-eco-400 transition-colors text-sm">Features</a>
              <a href="#mission" className="text-gray-500 hover:text-eco-400 transition-colors text-sm">Mission</a>
              <Link href="/dashboard" className="eco-btn text-xs py-2 px-4">Dashboard</Link>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <div className="text-gray-600 text-xs">
              Built with 💚 for the planet · EcoTrack360 © {new Date().getFullYear()}
            </div>
            <div className="text-gray-600 text-xs">
              Powered by Groq AI · Emission factors: EPA, DEFRA, IPCC
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
