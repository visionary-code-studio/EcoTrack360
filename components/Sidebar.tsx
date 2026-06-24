'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useApp } from '@/components/AppProvider';

const navItems = [
  { href: '/dashboard',          icon: '📊', label: 'Dashboard',   color: '#22c55e' },
  { href: '/dashboard/log',      icon: '➕', label: 'Log Activity', color: '#4ade80' },
  { href: '/dashboard/insights', icon: '🤖', label: 'AI Insights',  color: '#0ea5e9' },
  { href: '/dashboard/goals',    icon: '🎯', label: 'Goals',        color: '#f59e0b' },
  { href: '/dashboard/reports',  icon: '📋', label: 'Reports',      color: '#a78bfa' },
];

interface SidebarProps {
  ecoScore: number;
}

export default function Sidebar({ ecoScore }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useApp();

  const scoreColor = ecoScore >= 70 ? '#22c55e' : ecoScore >= 40 ? '#f59e0b' : '#f87171';
  const scoreMsg = ecoScore >= 70 ? '🌿 Excellent!' : ecoScore >= 40 ? '🌱 Keep going' : '⚡ Start now';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`sidebar fixed top-0 left-0 h-full flex flex-col z-40 transition-all duration-300`}
        style={{
          width: collapsed ? '72px' : '240px',
          background: 'rgba(8, 13, 8, 0.97)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(34, 197, 94, 0.1)',
        }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 p-5 pb-4`} style={{ borderBottom: '1px solid rgba(34,197,94,0.08)' }}>
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-xl bg-eco-500 opacity-20 blur-sm" />
            <Image src="/Logo.png" alt="Logo" width={36} height={36} className="relative rounded-xl" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm leading-tight truncate">EcoTrack360</div>
              <div className="text-eco-600 text-[10px] mt-0.5">Carbon Intelligence</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-gray-600 hover:text-eco-400 transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-eco-900/20"
          >
            <svg className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <div className="text-[10px] text-gray-600 uppercase tracking-widest px-4 pb-2 pt-1">Navigation</div>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-3' : ''} relative group`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && !collapsed && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: item.color }}
                  />
                )}
                <span className="text-lg flex-shrink-0 transition-transform group-hover:scale-110">
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
                {!collapsed && isActive && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Eco Score */}
        {!collapsed && (
          <div className="p-3">
            <div
              className="p-4 rounded-xl"
              style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">Eco Score</span>
                <span className="font-bold text-sm" style={{ color: scoreColor }}>{ecoScore}/100</span>
              </div>
              <div className="h-2 bg-surface-700 rounded-full overflow-hidden mb-2">
                <div
                  className="progress-bar h-full"
                  style={{ width: `${ecoScore}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)` }}
                />
              </div>
              <div className="text-xs" style={{ color: scoreColor }}>{scoreMsg}</div>
            </div>
          </div>
        )}

        {/* Back to home & Sign Out */}
        <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(34,197,94,0.08)' }}>
          <Link
            href="/"
            className={`nav-link ${collapsed ? 'justify-center px-3' : ''}`}
            title={collapsed ? 'Back to Home' : undefined}
          >
            <span className="text-lg flex-shrink-0">🏠</span>
            {!collapsed && <span className="text-sm">Home</span>}
          </Link>
          <button
            onClick={() => signOut(auth).then(() => router.push('/'))}
            className={`nav-link w-full text-left ${collapsed ? 'justify-center px-3' : ''}`}
            style={{ background: 'transparent', border: 'none' }}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <span className="text-lg flex-shrink-0">🚪</span>
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav
        className="mobile-nav fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2 px-1"
        style={{
          background: 'rgba(8, 13, 8, 0.97)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(34,197,94,0.12)',
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${
                isActive ? '' : 'text-gray-600'
              }`}
              style={{ color: isActive ? item.color : undefined }}
            >
              <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: item.color }} />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
