'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Initialize user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: name || user.email?.split('@')[0] || 'Eco User',
          email: user.email,
          createdAt: new Date().toISOString(),
          lifestyleType: 'medium',
          city: 'Default City',
          householdSize: 2
        });

      } else {
        // Sign in user
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user profile in Firestore if it doesn't exist
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName || 'Eco User',
        email: user.email,
        createdAt: new Date().toISOString(),
        lifestyleType: 'medium',
        city: 'Default City',
        householdSize: 2
      }, { merge: true });

      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    const demoUser = {
      uid: 'demo-user-123',
      email: 'demo@ecotrack360.com',
      displayName: 'Demo User',
      isAnonymous: true
    };
    localStorage.setItem('eco_demo_user', JSON.stringify(demoUser));
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-900 px-4 relative overflow-hidden animated-bg">
      {/* Decorative glow elements */}
      <div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" 
        style={{ 
          background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)',
          zIndex: 1
        }} 
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" 
        style={{ 
          background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)',
          zIndex: 1
        }} 
      />

      <div className="relative w-full max-w-md z-10 fade-in-up">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-2xl bg-eco-500 opacity-25 blur-lg" />
            <Link href="/">
              <Image 
                src="/Logo.png" 
                alt="EcoTrack360 Logo" 
                width={56} 
                height={56} 
                className="relative rounded-2xl cursor-pointer hover:scale-105 transition-transform" 
              />
            </Link>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">EcoTrack360</h1>
          <p className="text-gray-400 text-xs mt-1">Measure. Understand. Reduce. Sustain.</p>
        </div>

        {/* Card Container */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {isSignUp ? 'Create your Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleCredentialSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="eco-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="eco-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="eco-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full eco-btn justify-center mt-2"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-eco-500/30 hover:border-eco-500 hover:bg-eco-950/20 text-eco-400 font-semibold text-sm transition-all"
          >
            ⚡ Continue in Demo Mode (Bypass Auth)
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-700"></div>
            </div>
            <span className="relative bg-[#111810] px-3 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Or Connect With
            </span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-surface-700 hover:border-eco-500/50 hover:bg-surface-800 text-gray-300 font-medium text-sm transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center text-xs text-gray-400">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-eco-400 hover:text-eco-300 font-bold transition-colors"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-eco-400 hover:text-eco-300 font-bold transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
