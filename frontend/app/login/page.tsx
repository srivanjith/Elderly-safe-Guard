'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Mail, Key } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../lib/authContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success && res.data.token) {
        login(res.data.token, res.data.user);
        return;
      }
    } catch (err: any) {
      if (email.endsWith('@safepay.demo') || email.includes('demo')) {
        demoLogin(email);
        return;
      }
      if (!err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Backend server is offline. Use the 1-Click Demo Login Presets above to test.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans flex items-center justify-center">
      <div className="max-w-md w-full relative z-10 my-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-0.5 shadow-lg shadow-blue-600/20 mx-auto mb-4">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Log In to SafePay</h1>
          <p className="text-sm font-medium text-slate-600 mt-2">AI-Powered Scam Protection Platform</p>
        </div>


        {/* 1-Click Demo Login Box */}
        <div className="mb-6 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-md text-center">
          <span className="block text-xs font-black text-blue-600 uppercase tracking-wider mb-3">
            ⚡ Quick Demo 1-Click Login Presets
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => demoLogin('elderly@safepay.demo')}
              className="py-3 px-2 rounded-xl bg-slate-50 hover:bg-blue-100 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-extrabold transition-all"
            >
              👵 Elderly
            </button>
            <button
              onClick={() => demoLogin('guardian@safepay.demo')}
              className="py-3 px-2 rounded-xl bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 border border-slate-200 text-xs font-extrabold transition-all"
            >
              🛡️ Guardian
            </button>
            <button
              onClick={() => demoLogin('admin@safepay.demo')}
              className="py-3 px-2 rounded-xl bg-slate-50 hover:bg-purple-100 text-slate-700 hover:text-purple-700 border border-slate-200 text-xs font-extrabold transition-all"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elderly@safepay.demo"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Key className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-base shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.02]"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Create Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

