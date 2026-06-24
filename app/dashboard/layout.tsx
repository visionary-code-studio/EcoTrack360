'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useApp, AppProvider } from '@/components/AppProvider';
import Sidebar from '@/components/Sidebar';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, userLoading, summary, sidebarCollapsed } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  // Loading screen matching the premium EcoTrack360 design
  if (userLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center relative overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none" 
          style={{ 
            background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
            zIndex: 1
          }} 
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-eco-500 opacity-20 blur-md pulse-ring" style={{ animation: 'pulse 1.8s infinite' }} />
            <Image 
              src="/Logo.png" 
              alt="EcoTrack360 Logo" 
              width={64} 
              height={64} 
              className="relative rounded-2xl" 
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Loading Dashboard</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If check finished and no user, return null (handled by useEffect redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-900">
      {/* Mobile Top Header */}
      <header className="mobile-header md:hidden flex items-center justify-between p-4 border-b border-surface-800 bg-surface-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Image src="/Logo.png" alt="Logo" width={28} height={28} className="rounded-lg" />
          <span className="text-white font-bold text-sm">EcoTrack360</span>
        </div>
        <button 
          onClick={() => signOut(auth).then(() => router.push('/'))}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-1 bg-transparent"
        >
          <span>🚪</span> Log Out
        </button>
      </header>

      <Sidebar ecoScore={summary.ecoScore} />
      <main
        className="main-content flex-1 min-h-screen"
        style={{ marginLeft: sidebarCollapsed ? '72px' : '240px', transition: 'margin 0.3s ease' }}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <DashboardShell>{children}</DashboardShell>
    </AppProvider>
  );
}
