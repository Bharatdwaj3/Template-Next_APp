'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const inputClass = 'w-full bg-white border border-[#d4c9b0] rounded-xl px-4 py-3 text-sm text-[#1a3d2b] placeholder:text-[#a09880] focus:outline-none focus:border-[#1a3d2b] transition-colors disabled:opacity-50';

const ERROR_CODES: Record<string, string> = {
  EMAIL_EXISTS:       'An account with this email already exists.',
  VALIDATION_ERROR:   'Please fill in all required fields.',
  REGISTRATION_ERROR: 'Server error. Please try again.',
};

type AccountType = 'buyer' | 'farmer' | 'grocer';

const ACCOUNT_OPTIONS: { value: AccountType; label: string; icon: string }[] = [
  { value: 'buyer',  label: 'Buyer',  icon: '🛒' },
  { value: 'farmer', label: 'Farmer', icon: '🌱' },
  { value: 'grocer', label: 'Grocer', icon: '🏪' },
];

export default function RegisterPage() {
  const router = useRouter();

  const [accountType, setAccountType] = useState<AccountType>('buyer');
  const [form, setForm] = useState({ userName: '', fullName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, accountType }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(ERROR_CODES[data.code] ?? data.message ?? 'Registration failed');
        return;
      }
      if (data.requiresVerification) {
        router.push(`/features/auth/verify?email=${encodeURIComponent(form.email)}`);
      } else {
        router.push('/features/produce');
      }
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
        <div>
          <div className="w-12 h-0.5 mb-6" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
          <blockquote className="text-3xl font-black text-white uppercase leading-tight tracking-tight mb-4">
            &quot;Join the living<br />network of<br />earth&apos;s growers.&quot;
          </blockquote>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#e8c84a]/50">— Nerthus Community</p>
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
        className="flex-1 flex items-center justify-center px-8 py-14 overflow-y-auto"
      >
        <div className="w-full max-w-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-2">Get Started</p>
          <h1 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight mb-1">Create Account</h1>
          <div className="w-8 h-0.5 mb-8" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />

          <div className="flex gap-1.5 mb-6 bg-white border border-[#d4c9b0] rounded-xl p-1">
            {ACCOUNT_OPTIONS.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setAccountType(value)}
                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  accountType === value
                    ? 'bg-[#1a3d2b] text-[#e8c84a] shadow'
                    : 'text-[#8a9a8e] hover:text-[#1a3d2b]'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-[#e86c2a]/10 border border-[#e86c2a]/30 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={15} className="text-[#e86c2a] shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-[#e86c2a]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] block mb-1.5">Username</label>
              <input
                type="text"
                placeholder="your_handle"
                value={form.userName}
                onChange={(e) => update('userName', e.target.value)}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] block mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
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
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className={`${inputClass} pr-10`}
                  required
                  minLength={8}
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
                ? <><Loader2 size={14} className="animate-spin" /> Creating account...</>
                : <>Join Nerthus <ArrowRight size={14} /></>
              }
            </button>
          </form>

          <p className="text-center text-[11px] text-[#8a9a8e] mt-8">
            Already a member?{' '}
            <Link
              href="/features/auth/login"
              className="font-black text-[#1a3d2b] hover:text-[#e86c2a] transition-colors uppercase tracking-widest"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}