'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Heart, Users, Sparkles, CheckCircle2, ArrowUpRight, Lock, Award, Building } from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-700 text-xs font-black uppercase tracking-wider"
          >
            <Shield className="w-4 h-4 text-sky-600" />
            <span>Our Mission & Core Vision</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900"
          >
            Protecting vulnerable users from <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              digital financial fraud
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed"
          >
            Every year, billions of dollars are stolen from senior citizens through social engineering, fake lottery alerts, impersonation schemes, and urgent UPI coercion. SafePay Guardian was born to solve this.
          </motion.p>
        </div>

        {/* 3 Pillars Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Family-First Protection</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              We empower adult children and trusted family members to serve as an instant safety net, verifying high-value or suspicious transfers in real time.
            </p>
            <Link href="/guardians" className="inline-flex items-center gap-1 text-xs text-rose-600 font-bold hover:underline">
              Family Guardian Network ↗
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Ethical AI Intervention</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Our Machine Learning engines evaluate transaction behavior without intrusive surveillance, scoring risk dynamically and intercepting anomalous activity.
            </p>
            <Link href="/features" className="inline-flex items-center gap-1 text-xs text-purple-600 font-bold hover:underline">
              Explore AI Features ↗
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Zero Friction Payments</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Safe, routine payments (groceries, utilities, verified family members) pass through instantly with zero delay. Intervention occurs only when risk is high.
            </p>
            <Link href="/send-money" className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:underline">
              Try Payment Engine ↗
            </Link>
          </div>

        </div>

        {/* Company Stats Banner */}
        <div className="p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <span className="block text-4xl sm:text-5xl font-black text-slate-900">150,000+</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">Active Users Protected</span>
          </div>
          <div>
            <span className="block text-4xl sm:text-5xl font-black text-emerald-600">10,000+</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">Scams Intercepted</span>
          </div>
          <div>
            <span className="block text-4xl sm:text-5xl font-black text-purple-600">99.9%</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">AI Engine Accuracy</span>
          </div>
          <div>
            <span className="block text-4xl sm:text-5xl font-black text-blue-600">&lt; 85ms</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">Average ML Latency</span>
          </div>
        </div>

        {/* Story Section */}
        <div className="p-10 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
          <span className="text-xs font-black uppercase text-purple-600 tracking-wider">Why We Built SafePay Guardian</span>
          <h2 className="text-3xl font-black text-slate-900">Bridging the Generational Digital Trust Gap</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl font-medium">
            As payment systems transition to instant digital UPI transfers, scam artists increasingly target senior citizens with high-pressure tactics — posing as bank officers, tax officials, or tech support. SafePay Guardian provides a non-intrusive safety cushion by combining machine learning anomaly detection with instant family confirmation.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform"
            >
              <span>Join SafePay Guardian</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/help"
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-sm border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              Help & FAQ Center
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
