'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, User, Mail, Key, Phone, HeartHandshake } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../lib/authContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'ELDERLY_USER' | 'GUARDIAN'>('ELDERLY_USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { name, email, password, phone, role });
      if (res.data.success && res.data.token) {
        login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans flex items-center justify-center">
      <div className="max-w-md w-full my-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-600 font-medium mt-2">Join SafePay Guardian for protected payments</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Toggle Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Select Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('ELDERLY_USER')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    role === 'ELDERLY_USER'
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Elderly / User</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('GUARDIAN')}
                  className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    role === 'GUARDIAN'
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5 text-indigo-600" />
                  <span>Trusted Guardian</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramakrishna Sharma"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@safepay.demo"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Key className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
