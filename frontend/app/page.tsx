'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Eye, Sparkles, UserCheck, Cpu, Bell, ShieldCheck, CheckCircle2, Send, Users, Shield, HelpCircle, Activity, Lock } from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function LandingPage() {
  const { demoLogin, user } = useAuth();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      
      {/* Background Geometrical Light Grids */}
      <div className="absolute top-0 right-0 w-1/2 h-[700px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-8 z-10">
            
            {/* Top Subtitle Tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/features"
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Payment Protection of the Future ↗</span>
              </Link>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900"
            >
              Transfer money <br />
              with AI era <br />
              <span className="text-blue-600">protection</span>
            </motion.h1>

            {/* Subheadline Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed font-medium"
            >
              SafePay Guardian is the all-in-one digital payment platform with real-time scam interception, anomaly detection, and trusted family guardian holds.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2 flex flex-wrap gap-4"
            >
              {!user ? (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-base font-extrabold shadow-lg shadow-blue-600/30 hover:scale-105 transition-all"
                >
                  <span>Get Started Now</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href={user.role === 'GUARDIAN' ? '/guardian-dashboard' : user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard'}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-base font-extrabold shadow-lg shadow-blue-600/30 hover:scale-105 transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              )}

              <Link
                href="/features"
                className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-md text-slate-800 font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Explore Features</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </Link>
            </motion.div>

            {/* Bottom Metrics Counter Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-200 max-w-md"
            >
              <Link href="/about" className="group text-left">
                <span className="block text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">150k+</span>
                <span className="text-xs text-slate-500 font-medium group-hover:underline">Protected Users ↗</span>
              </Link>

              <Link href="/security" className="border-l border-slate-200 pl-6 group text-left">
                <span className="block text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">10k+</span>
                <span className="text-xs text-slate-500 font-medium group-hover:underline">Scams Prevented ↗</span>
              </Link>

              <Link href="/features" className="border-l border-slate-200 pl-6 group text-left">
                <span className="block text-3xl sm:text-4xl font-black text-blue-600 group-hover:text-purple-600 transition-colors">99.9%</span>
                <span className="text-xs text-slate-500 font-medium group-hover:underline">AI Accuracy ↗</span>
              </Link>
            </motion.div>

          </div>

          {/* Right Hero Column - Interactive 3D Card Stack Visual */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[480px]">
            
            {/* Fine Geometrical Grid Pattern in Background */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-3 opacity-20 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-slate-300 rounded-xl" />
              ))}
            </div>

            {/* 3D Floating Payment & Shield Card Stack */}
            <div className="relative w-full max-w-md h-[420px] flex items-center justify-center">
              
              {/* Card 4: Dark Charcoal -> Links to Transactions */}
              <Link href="/transactions" className="block cursor-pointer">
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [20, 22, 20] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-24 right-4 w-64 h-40 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black p-5 border border-white/10 shadow-2xl z-0 hover:border-blue-400 transition-colors text-white"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-400 tracking-wider">SafePay Titanium</span>
                    <span className="text-xs text-slate-300 font-extrabold">VISA</span>
                  </div>
                  <div className="mt-8">
                    <p className="text-xs text-slate-300 font-semibold">Ramakrishna Sharma</p>
                    <p className="text-xs font-mono text-slate-400 mt-1">12/28 • SECURE HISTORY ↗</p>
                  </div>
                </motion.div>
              </Link>

              {/* Card 3: Mint Cyan -> Links to Family Guardians */}
              <Link href="/guardians" className="block cursor-pointer">
                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [8, 10, 8] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-12 right-12 w-68 h-40 rounded-2xl bg-gradient-to-tr from-teal-700 via-cyan-700 to-emerald-700 p-5 border border-cyan-300/40 shadow-2xl z-10 hover:border-cyan-200 transition-colors text-white"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold text-cyan-100">Family Shield Pass</span>
                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center text-xs font-bold text-cyan-200">🛡️</div>
                  </div>
                  <div className="mt-10 flex justify-between items-end">
                    <span className="text-xs font-mono tracking-widest text-cyan-100">2345 1231 1131 3467</span>
                    <span className="text-[10px] font-black text-cyan-200 bg-cyan-950/60 px-2 py-0.5 rounded-md">MANAGE GUARDIANS ↗</span>
                  </div>
                </motion.div>
              </Link>

              {/* Card 2: Deep Purple -> Links to Guardian Dashboard */}
              <Link href="/guardian-dashboard" className="block cursor-pointer">
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [-12, -14, -12] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-6 left-6 w-72 h-44 rounded-2xl bg-gradient-to-tr from-[#3b2a6b] via-[#6d4dc5] to-[#8b5cf6] p-5 border border-purple-300/40 shadow-2xl z-20 hover:border-purple-200 transition-colors text-white"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold text-white tracking-wide">Guardian AI Card</span>
                    <div className="flex -space-x-2">
                      <div className="w-5 h-5 rounded-full bg-rose-500/80" />
                      <div className="w-5 h-5 rounded-full bg-amber-400/80" />
                    </div>
                  </div>
                  <div className="mt-10">
                    <p className="text-sm font-mono tracking-widest text-white font-extrabold">516 2273 2271 1584</p>
                    <div className="flex justify-between items-center mt-3 text-[11px] text-purple-200 font-semibold">
                      <span>Arun Sharma (Son)</span>
                      <span>APPROVAL QUEUE ↗</span>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Card 1: Main Metallic Silver Card -> Links to Send Money */}
              <Link href="/send-money" className="block cursor-pointer">
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [-4, -2, -4] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-16 left-2 w-76 h-48 rounded-2xl bg-white text-slate-900 p-6 border border-slate-200 shadow-2xl z-30 transform hover:scale-105 transition-transform"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        ✦
                      </div>
                      <span className="font-extrabold text-sm tracking-tight text-slate-900">SafePay Prime</span>
                    </div>
                    {/* EMV Chip */}
                    <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-300 to-yellow-500 border border-amber-600/40" />
                  </div>

                  <div className="mt-8">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Card Holder</p>
                    <p className="text-base font-black text-slate-900 tracking-wide">Jeremy Smith</p>
                  </div>

                  <div className="mt-3 flex justify-between items-center text-xs font-mono font-bold text-slate-600">
                    <span>4342 0873 4311 7320</span>
                    <span className="text-blue-600 font-extrabold flex items-center gap-1">SEND MONEY ↗</span>
                  </div>
                </motion.div>
              </Link>

              {/* Leather Card Holder Sleeve beneath */}
              <Link href="/features" className="absolute bottom-4 left-10 w-64 h-32 rounded-2xl bg-white border border-slate-200/80 shadow-md z-10 flex items-end p-4 hover:border-blue-400 transition-colors">
                <div className="w-full flex justify-between items-center text-xs font-extrabold text-slate-600">
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-blue-600" /> SafePay Sleeve</span>
                  <span className="text-blue-600">FEATURES ↗</span>
                </div>
              </Link>

            </div>

            {/* Circular Spinning Eye Badge on Bottom Right -> Smooth Scroll */}
            <button
              onClick={scrollToHowItWorks}
              className="absolute bottom-0 right-0 z-40 flex items-center justify-center group cursor-pointer"
              title="Watch How It Works"
            >
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* SVG Rotating Text */}
                <svg className="w-full h-full spin-text" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9px] font-extrabold uppercase fill-slate-500 tracking-widest">
                    <textPath href="#circlePath" startOffset="0%">
                      • Watch how it works • Watch how it works
                    </textPath>
                  </text>
                </svg>

                {/* Eye Icon in Center */}
                <div className="absolute w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-blue-600 transition-all">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </button>

          </div>

        </div>
      </section>

      {/* Instant Demo Presets Strip */}
      <section id="demo-presets" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-2">
                ⚡ Instant Interactive Demo Access
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Select a Persona to Test Real-Time AI Interception</h3>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
              1-Click Instant Login Presets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => demoLogin('elderly@safepay.demo')}
              className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all group hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-2xl mb-4 group-hover:scale-110 transition-transform">
                👵
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600">Elderly Account</h4>
              <p className="text-xs text-slate-600 font-medium mt-1">Ramakrishna Sharma • Wallet: ₹1,50,000</p>
              <span className="inline-block mt-4 text-xs font-bold text-blue-600">Launch Elderly Portal ↗</span>
            </button>

            <button
              onClick={() => demoLogin('guardian@safepay.demo')}
              className="p-6 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all group hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-2xl mb-4 group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600">Guardian Account</h4>
              <p className="text-xs text-slate-600 font-medium mt-1">Arun Sharma (Son) • Intercepted Holds Queue</p>
              <span className="inline-block mt-4 text-xs font-bold text-indigo-600">Launch Guardian Gate ↗</span>
            </button>

            <button
              onClick={() => demoLogin('admin@safepay.demo')}
              className="p-6 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-left transition-all group hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-2xl mb-4 group-hover:scale-110 transition-transform">
                👑
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-purple-600">Fintech Admin</h4>
              <p className="text-xs text-slate-600 font-medium mt-1">Telemetry Metrics & Fraud Analytics Dashboard</p>
              <span className="inline-block mt-4 text-xs font-bold text-purple-600">Launch Analytics Suite ↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* Visual Flow & Step Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase text-blue-600 tracking-wider">3-Step Protection Engine</span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-2">Visual Transaction Protection Flow</h2>
          <p className="mt-4 text-slate-600 text-lg font-medium">
            Real-time AI scam interception preventing financial loss before funds leave the account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Link
            href="/send-money"
            className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-purple-500/40 transition-all group relative block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 font-black text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-purple-600">Payment Initiated</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
              User enters payee details and transfer amount. Real-time telemetry captures transaction context.
            </p>
            <span className="inline-block mt-4 text-xs font-bold text-purple-600">Try Send Money ↗</span>
          </Link>

          <Link
            href="/security"
            className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-sky-500/40 transition-all group relative block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 font-black text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-sky-600">AI Risk Score Evaluation</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
              ML Isolation Forest & Behavioral rules evaluate anomaly score (0–100) analyzing amount variance and device checks.
            </p>
            <span className="inline-block mt-4 text-xs font-bold text-sky-600">View ML Risk Rules ↗</span>
          </Link>

          <Link
            href="/guardian-dashboard"
            className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-emerald-500/40 transition-all group relative block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-emerald-600">Guardian Interception Hold</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
              High-risk payments are instantly frozen. Real-time Socket alert pushes decision prompt to trusted Guardian.
            </p>
            <span className="inline-block mt-4 text-xs font-bold text-emerald-600">View Guardian Approvals ↗</span>
          </Link>

        </div>
      </section>

      {/* Feature Navigation Showcase Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">Comprehensive Safety Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">Explore SafePay Guardian Pages</h2>
          </div>
          <Link href="/features" className="text-sm font-extrabold text-blue-600 hover:underline flex items-center gap-1">
            View All Features Matrix <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link
            href="/features"
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-purple-500/40 transition-all group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-purple-600">Features Deep-Dive</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">Detailed breakdown of ML models and real-time push alerts.</p>
          </Link>

          <Link
            href="/security"
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-emerald-500/40 transition-all group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-600">Security Architecture</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">Risk score matrices, encryption, and authorization protocols.</p>
          </Link>

          <Link
            href="/about"
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-sky-500/40 transition-all group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-sky-600">About & Mission</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">Our mission to protect senior citizens from financial fraud.</p>
          </Link>

          <Link
            href="/help"
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-amber-500/40 transition-all group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-amber-600">Help & FAQs</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">Searchable support topics and instant demo launcher.</p>
          </Link>

        </div>
      </section>

    </div>
  );
}
