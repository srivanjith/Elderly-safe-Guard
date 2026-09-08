'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Cpu, 
  Users, 
  Activity, 
  Zap, 
  Lock, 
  Bell, 
  ArrowUpRight, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export default function FeaturesPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-black uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Next-Gen Scam Prevention Stack</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900"
          >
            Built to stop payment fraud <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              before money leaves the wallet
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed"
          >
            SafePay Guardian combines real-time ML risk scoring, behavioral anomaly biometrics, and immediate family guardian intervention to shield vulnerable users.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            {!user ? (
              <Link
                href="/register"
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <span>Get Started Now</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/send-money"
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Send className="w-5 h-5" />
                <span>Test Protected Transfer</span>
              </Link>
            )}

            <Link
              href="/security"
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 shadow-md font-bold flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <span>Explore Security Stack</span>
            </Link>
          </motion.div>
        </div>

        {/* Core Feature Cards Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-purple-500/40 transition-all group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-7 h-7" />
            </div>
            <span className="text-xs font-black uppercase text-purple-600 tracking-wider">Feature 01</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Real-Time ML Risk Scoring</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed font-medium">
              Every outgoing transfer undergoes instant Machine Learning evaluation (0–100 score matrix) measuring recipient history, transaction velocity, and amount anomaly ratios.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Latency: &lt; 85ms</span>
              <Link href="/security" className="text-blue-600 hover:underline flex items-center gap-1">
                View Risk Model <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-sky-500/40 transition-all group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <span className="text-xs font-black uppercase text-sky-600 tracking-wider">Feature 02</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Family Guardian Interception</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed font-medium">
              High-risk payments to unknown or untrusted accounts trigger an automatic Guardian Hold. Trusted adult children receive instant socket notifications to approve or block.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Multi-User Sync</span>
              <Link href="/guardians" className="text-sky-600 hover:underline flex items-center gap-1">
                Manage Guardians <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-emerald-500/40 transition-all group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7" />
            </div>
            <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">Feature 03</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Behavioral Telemetry</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed font-medium">
              Monitors device fingerprinting, time-of-day access, rapid successive transfers, and panic-level amounts to flag coercion and impersonation scams instantly.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Behavioral Rules</span>
              <Link href="/help" className="text-emerald-600 hover:underline flex items-center gap-1">
                Learn Telemetry <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-amber-500/40 transition-all group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bell className="w-7 h-7" />
            </div>
            <span className="text-xs font-black uppercase text-amber-600 tracking-wider">Feature 04</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Instant Socket Push Alerts</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed font-medium">
              Zero-polling WebSocket alerts push pending high-risk requests directly to the Guardian app with 1-click Approve or Block action cards.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Real-Time WebSockets</span>
              <Link href="/notifications" className="text-amber-600 hover:underline flex items-center gap-1">
                View Notifications <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-rose-500/40 transition-all group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <span className="text-xs font-black uppercase text-rose-600 tracking-wider">Feature 05</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Emergency Account Freeze</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed font-medium">
              If an elderly user is actively targeted by scammers, Guardians can initiate an emergency freeze on all outgoing transactions directly from the dashboard.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Instant Lockdown</span>
              <Link href="/guardian-dashboard" className="text-rose-600 hover:underline flex items-center gap-1">
                Guardian Control <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-indigo-500/40 transition-all group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">Feature 06</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Fintech Telemetry Dashboard</h3>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed font-medium">
              Comprehensive analytics suite displaying transaction distribution, aggregate fraud preventions, active guardians, and risk score distributions.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Admin Telemetry</span>
              <Link href="/admin-dashboard" className="text-indigo-600 hover:underline flex items-center gap-1">
                Admin Suite <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Detailed How-it-Works Interactive Section */}
        <div id="how-it-works" className="p-10 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">Step-By-Step Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">How SafePay Guardian Works</h2>
            <p className="text-slate-600 text-sm mt-2 font-medium">
              From transfer request to risk analysis and guardian approval in under 3 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-lg shadow-md">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl">1. Initiating Payment</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                The user inputs payee details (UPI ID, account number, or name) and amount on the Send Money page.
              </p>
              <Link href="/send-money" className="inline-flex items-center gap-1 text-xs text-purple-600 font-bold hover:underline">
                Try Send Money ↗
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center text-lg shadow-md">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl">2. AI Model Evaluation</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                The Isolation Forest ML model checks payee history, amount thresholds, and behavioral signals to generate a 0-100 score.
              </p>
              <Link href="/security" className="inline-flex items-center gap-1 text-xs text-sky-600 font-bold hover:underline">
                Explore ML Logic ↗
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg shadow-md">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl">3. Guardian Decision</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                If marked HIGH risk, funds stay safely locked until the Guardian reviews transaction details and clicks Approve or Block.
              </p>
              <Link href="/guardian-dashboard" className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:underline">
                View Guardian Queue ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Ready to protect your family payments?</h3>
            <p className="text-slate-600 text-sm mt-1 font-medium">Set up your Guardian account or test out interactive demo personas instantly.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform"
            >
              Test Demo Persona
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-sm border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              Register Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
