'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Heart, Lock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#09090e] border-t border-slate-800/80 text-slate-400 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#a588f7] via-sky-400 to-[#e2fb42] flex items-center justify-center p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0b0b10] rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#e2fb42]" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SafePay<span className="text-[#a588f7]">Guardian</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              AI-driven scam interception platform protecting senior citizens and family members before money leaves their digital wallets.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#12121a] border border-white/10 px-3 py-2 rounded-xl inline-flex">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Real-Time ML Interception Active</span>
            </div>
          </div>

          {/* Product & Features Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="/features" className="hover:text-[#a588f7] transition-colors">AI Risk Features</Link>
              </li>
              <li>
                <Link href="/send-money" className="hover:text-[#a588f7] transition-colors">Send Money</Link>
              </li>
              <li>
                <Link href="/guardians" className="hover:text-[#a588f7] transition-colors">Guardian Holds</Link>
              </li>
              <li>
                <Link href="/transactions" className="hover:text-[#a588f7] transition-colors">Transaction History</Link>
              </li>
            </ul>
          </div>

          {/* Security & Tech Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Security</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="/security" className="hover:text-[#a588f7] transition-colors">Security Stack</Link>
              </li>
              <li>
                <Link href="/guardian-dashboard" className="hover:text-[#a588f7] transition-colors">Guardian Gate</Link>
              </li>
              <li>
                <Link href="/admin-dashboard" className="hover:text-[#a588f7] transition-colors">Fintech Analytics</Link>
              </li>
              <li>
                <Link href="/notifications" className="hover:text-[#a588f7] transition-colors">Socket Alerts</Link>
              </li>
            </ul>
          </div>

          {/* Resources & Support Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Company & Support</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="/about" className="hover:text-[#a588f7] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-[#a588f7] transition-colors">Help Center & FAQ</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#a588f7] transition-colors">User Profile</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#a588f7] transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-3">
          <p className="max-w-3xl mx-auto leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> SafePay Guardian is a working financial safety demonstration prototype. It is NOT connected to live production bank APIs or banking systems. No real funds or real credentials are used.
          </p>
          <p className="flex items-center justify-center gap-1">
            Built for Hackathons & Financial Security Innovation <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> © 2026 SafePay Guardian.
          </p>
        </div>

      </div>
    </footer>
  );
};
