'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Cpu, Key, FileText, CheckCircle, AlertOctagon, ArrowUpRight, Sparkles, Activity } from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export default function SecurityPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bank-Grade Encryption & AI Protection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900"
          >
            Security Architecture & <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Fraud Interception Protocol
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed"
          >
            Detailed documentation on how SafePay Guardian scores transactions, enforces multi-factor guardian holds, and protects digital wallets.
          </motion.p>
        </div>

        {/* Risk Score Threshold Breakdown Matrix */}
        <div className="p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-8">
          <div>
            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">AI Risk Score Matrix</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Real-Time Risk Classification Thresholds</h2>
            <p className="text-slate-600 text-sm mt-1">
              Every transaction generates a dynamic risk score between 0 and 100 based on machine learning anomaly detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Low Risk */}
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-700 font-extrabold text-xs border border-emerald-200">
                  LOW RISK (0–39)
                </span>
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Instant Approval</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Transfers to frequent recipients or standard routine amounts. Processed immediately without guardian interruption.
              </p>
            </div>

            {/* Medium Risk */}
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-700 font-extrabold text-xs border border-amber-200">
                  MEDIUM RISK (40–69)
                </span>
                <Activity className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Soft Warning Alert</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Unusual transfer amounts or new recipient addresses. Displays interactive scam warning prompts to the user before confirmation.
              </p>
            </div>

            {/* High Risk */}
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200">
                  HIGH RISK (70–100)
                </span>
                <AlertOctagon className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Guardian Interception Hold</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                High-amount transfers to unverified accounts, sudden speed transfers, or flagged scam UPIs. Instantly frozen pending Guardian approval.
              </p>
            </div>

          </div>
        </div>

        {/* Security Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">TLS & AES-256 Data Protection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              All communications between client devices, the Node.js API, and Python ML telemetry microservices are encrypted using TLS 1.3 and AES-256 payload encryption.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">JWT Role-Based Access Control (RBAC)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Strict endpoint authorization ensures Elderly users, Guardians, and Admins can only perform actions authorized by their verified roles and cryptographic JWT tokens.
            </p>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md text-center space-y-6">
          <h3 className="text-3xl font-black text-slate-900">Want to experience SafePay Guardian in action?</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
            Test sending high-risk and low-risk payments using our instant 1-click demo persona accounts.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/send-money"
              className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <span>Test Protected Payment</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}