'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/authContext';
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  History, 
  Settings, 
  Search, 
  Sun, 
  Bell, 
  ShieldCheck, 
  ShieldAlert, 
  Wallet, 
  Clock, 
  ChevronRight, 
  MoreHorizontal, 
  Lock, 
  Shield, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import api from '../../lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [guardians, setGuardians] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = async () => {
    try {
      const [txRes, gRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/guardians')
      ]);

      if (txRes.data.success) {
        setTransactions(txRes.data.transactions || []);
      }
      if (gRes.data.success) {
        setGuardians(gRes.data.guardians || []);
      }
    } catch (err) {
      console.error('[Dashboard] Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Exact mockup fallback data matching user's new screenshot
  const defaultMockTransactions = [
    {
      _id: 'tx1',
      recipientName: 'Ravi Kumar',
      recipientId: 'ravi@safepay.com',
      amount: 50000,
      riskScore: 85,
      riskLevel: 'HIGH',
      status: 'PENDING_GUARDIAN_APPROVAL',
      createdAt: '9/8/2026, 9:22:07 AM'
    },
    {
      _id: 'tx2',
      recipientName: 'International Telecom Scam Outlet',
      recipientId: 'lottery_claim@fastpay',
      amount: 85000,
      riskScore: 95,
      riskLevel: 'HIGH',
      status: 'CANCELLED',
      createdAt: '9/8/2026, 9:18:07 AM'
    },
    {
      _id: 'tx3',
      recipientName: 'Amazon Purchase',
      recipientId: 'amazon@pay.com',
      amount: 2500,
      riskScore: 12,
      riskLevel: 'LOW',
      status: 'COMPLETED',
      createdAt: '9/7/2026, 6:45:32 PM'
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : defaultMockTransactions;
  const totalProtectedCount = displayTransactions.length || 5;
  const suspiciousBlockedCount = displayTransactions.filter(t => t.riskLevel === 'HIGH' || t.status === 'CANCELLED' || t.status === 'BLOCKED').length || 3;

  const filteredTransactions = displayTransactions.filter(tx => 
    tx.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.recipientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white flex flex-col font-sans pl-16 md:pl-24">
      
      {/* Main Content Area (Light Theme) */}
      <div className="flex-1 flex flex-col min-w-0 max-w-7xl w-full mx-auto">

        {/* Dashboard Workspace */}
        <main className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* Executive Sky-Blue Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#eff6ff] to-[#e0f2fe] border border-blue-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 group"
          >
            <div className="space-y-4 z-10 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                AI PROTECTION ACTIVE
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Welcome Back, <br />
                <span className="text-blue-600">
                  {user?.name || 'Ramakrishna Sharma'}
                </span> 👋
              </h1>

              <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                Your payments are protected by <span className="text-blue-600 font-semibold">SafePay Guardian AI</span> & trusted family members.
              </p>
            </div>

            {/* Right Side 3D Shield & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full md:w-auto">
              
              {/* 3D Blue Shield Graphic */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 border border-blue-300 flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0"
              >
                <Shield className="w-14 h-14 text-white drop-shadow-md" />
                <Users className="w-6 h-6 text-sky-200 absolute" />
              </motion.div>

              {/* Action Button & Handwritten Annotation */}
              <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
                
                <span className="text-xs font-handwriting text-blue-600 italic font-medium -mb-1">
                  Your Family Our Priority ⤴
                </span>

                <Link
                  href="/send-money"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  <span>SEND MONEY NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </motion.div>

          {/* 4 Pastel Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Wallet Balance */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="p-6 rounded-3xl bg-[#e6fcf5] border border-[#b2f5ea] shadow-sm transition-all relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Wallet Balance</span>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5 block">
                      ₹{user?.walletBalance?.toLocaleString() || '150,000'}
                    </span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/80 border border-teal-200 flex items-center justify-center text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-teal-200/60 text-xs text-teal-700 font-semibold flex items-center gap-1">
                ✓ Safe Demo Wallet
              </div>
            </motion.div>

            {/* Card 2: Transfers Screened */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="p-6 rounded-3xl bg-[#edf2ff] border border-[#bac8ff] shadow-sm transition-all relative overflow-hidden group cursor-pointer"
            >
              <Link href="/transactions" className="block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Transfers Screened</span>
                      <span className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5 block">
                        {totalProtectedCount}
                      </span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/80 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-200/60 text-xs text-slate-500 font-medium">
                  Evaluated by AI Engine
                </div>
              </Link>
            </motion.div>

            {/* Card 3: Scams Intercepted */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="p-6 rounded-3xl bg-[#fff0f6] border border-[#ffc9c9] shadow-sm transition-all relative overflow-hidden group cursor-pointer"
            >
              <Link href="/transactions" className="block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Scams Intercepted</span>
                      <span className="text-2xl font-bold text-rose-600 tracking-tight mt-0.5 block">
                        {suspiciousBlockedCount}
                      </span>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/80 border border-rose-200 flex items-center justify-center text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-200/60 text-xs text-slate-500 font-medium">
                  High Risk / Intercepted
                </div>
              </Link>
            </motion.div>

            {/* Card 4: Primary Guardian */}
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="p-6 rounded-3xl bg-[#e7f5ff] border border-[#a5d8ff] shadow-sm transition-all relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-md">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Primary Guardian</span>
                    <span className="text-base font-bold text-slate-900 truncate block mt-0.5">
                      Arun Sharma (Son)
                    </span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/80 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-sky-200/60 flex items-center justify-between text-xs">
                <span className="text-sky-800 font-semibold">
                  Son - Primary
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-300">
                  Active
                </span>
              </div>
            </motion.div>

          </div>

          {/* Main Grid: Recent Payments & Family Guardians */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Recent Payments Feed (Pure White Card) */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>Recent Payments</span>
                </h2>
                <Link href="/transactions" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  View Complete History →
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 font-medium">Loading payment transactions...</div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((tx, idx) => {
                    const isHighRisk = tx.riskLevel === 'HIGH' || tx.riskScore >= 70;
                    const isCompleted = tx.status === 'COMPLETED';
                    const isPending = tx.status === 'PENDING_GUARDIAN_APPROVAL';
                    const isCancelled = tx.status === 'CANCELLED' || tx.status === 'BLOCKED';

                    return (
                      <motion.div
                        key={tx._id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.01, x: 3 }}
                        className={`p-4 sm:p-5 rounded-2xl bg-[#f8fa00]/5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group relative overflow-hidden ${
                          isHighRisk 
                            ? 'bg-[#fff5f5] border-rose-200 hover:border-rose-300' 
                            : 'bg-[#f4fbf7] border-emerald-200 hover:border-emerald-300'
                        }`}
                      >
                        {/* Left Color Accent Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isHighRisk ? 'bg-rose-500' : 'bg-emerald-500'}`} />

                        {/* Left Payee Info */}
                        <div className="flex items-center gap-4 pl-2">
                          <div className="w-11 h-11 rounded-2xl bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                            ₹
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                              {tx.recipientName}
                            </h4>
                            <p className="text-xs text-slate-400 font-normal">
                              {tx.recipientId} • {tx.createdAt}
                            </p>
                          </div>
                        </div>

                        {/* Status & Amount */}
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          
                          {/* Risk Badge Pill */}
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                            isHighRisk
                              ? 'bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}>
                            <Shield className="w-3.5 h-3.5" />
                            <span>{isHighRisk ? `HIGH RISK • ${tx.riskScore}/100` : `LOW RISK • ${tx.riskScore}/100`}</span>
                          </div>

                          {/* Amount & Status Label */}
                          <div className="text-right shrink-0 min-w-[140px]">
                            <span className="text-base font-bold text-slate-900 block">
                              ₹{tx.amount?.toLocaleString()}
                            </span>
                            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${
                              isCompleted 
                                ? 'text-emerald-600' 
                                : isPending 
                                  ? 'text-amber-600 font-bold' 
                                  : 'text-rose-600 font-bold'
                            }`}>
                              {tx.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-400">
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Family Guardians Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>Family Guardians</span>
                  </h3>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Guardians automatically receive high-risk transfer alerts to confirm or block transfers before funds leave your wallet.
                </p>

                {/* Guardian List Items */}
                <div className="space-y-3">
                  
                  {/* Guardian 1 */}
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-blue-400 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        A
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          Arun Sharma (Son)
                        </h4>
                        <p className="text-[11px] text-slate-500 font-normal">Son • guardian@safepay.demo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                        Primary
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </motion.div>

                  {/* Guardian 2 */}
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-400 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        S
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                          Sneha Sharma (Wife)
                        </h4>
                        <p className="text-[11px] text-slate-500 font-normal">Wife • sneha@safepay.demo</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </motion.div>

                  {/* Guardian 3 */}
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-pink-400 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        P
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm group-hover:text-pink-600 transition-colors">
                          Priya Sharma (Daughter)
                        </h4>
                        <p className="text-[11px] text-slate-500 font-normal">Daughter • priya@safepay.demo</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all" />
                  </motion.div>

                </div>
              </div>

              {/* Manage Guardians Button */}
              <Link
                href="/guardians"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all group shadow-md"
              >
                <Plus className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
                <span>Manage Family Guardians</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
