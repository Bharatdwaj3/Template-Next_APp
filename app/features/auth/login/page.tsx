'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchUser } from '@/store/avatarSlice';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const inputClass = 'w-full bg-white border border-[#d4c9b0] rounded-xl px-4 py-3 text-sm text-[#1a3d2b] placeholder:text-[#a09880] focus:outline-none focus:border-[#1a3d2b] transition-colors disabled:opacity-50';

const ERROR_CODES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email or password is incorrect',
  ACCOUNT_DEACTIVATED: 'Your account has been deactivated. Contact support.',
  MISSING_CREDENTIALS: 'Please enter both email and password',
  LOGIN_FAILED: 'Server error. Please try again.',
};

const getRedirect = (accountType: string, id: string) => {
  if (accountType === 'farmer') return `/features/farmer/${id}`;
  if (accountType === 'grocer') return `/features/grocer/${id}`;
  return '/features/produce';
};

export default function LoginPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(ERROR_CODES[data.code] ?? data.message ?? 'Something went wrong');
        return;
      }
      dispatch(fetchUser());
      router.push(getRedirect(data.user.accountType, data.user.id));
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex">
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-[45%] bg-[#1a3d2b] flex-col justify-between px-16 py-14 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />
        <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center overflow-hidden pointer-events-none">
          <span
            className="text-[8rem] font-black text-white/[0.04] uppercase select-none whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', letterSpacing: '-0.05em' }}
          >
            Nerthus
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-[#e8c84a]" />
          <span className="text-white font-black text-xl uppercase italic tracking-tight">Nerthus</span>
        </div>
        <div>
          <div className="w-12 h-0.5 mb-6" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
          <blockquote className="text-3xl font-black text-white uppercase leading-tight tracking-tight mb-4">
            &quot;From the<br />goddess earth,<br />all things<br />are nourished.&quot;
          </blockquote>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#e8c84a]/50">— Tacitus, Germania</p>
        </div>
        <div className="flex gap-8">
          {[['2,400+', 'Growers'], ['18', 'Counties'], ['100%', 'Organic']].map(([num, label]) => (
            <div key={label}>
              <p className="text-xl font-black text-[#e8c84a]">{num}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center px-8"
      >
        <div className="w-full max-w-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-2">Welcome Back</p>
          <h1 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight mb-1">Sign In</h1>
          <div className="w-8 h-0.5 mb-8" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />

          {error && (
            <div className="flex items-start gap-3 bg-[#e86c2a]/10 border border-[#e86c2a]/30 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={15} className="text-[#e86c2a] shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-[#e86c2a]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a9a8e] hover:text-[#1a3d2b] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1a3d2b] text-[#e8c84a] text-[11px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Signing In...</>
                : <>Sign In <ArrowRight size={14} /></>
              }
            </button>
          </form>

          <p className="text-center text-[11px] text-[#8a9a8e] mt-8">
            No account?{' '}
            <Link
              href="/features/auth/register"
              className="font-black text-[#1a3d2b] hover:text-[#e86c2a] transition-colors uppercase tracking-widest"
            >
              Join Nerthus
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}