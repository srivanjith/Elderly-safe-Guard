'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, Shield, Users, Send, AlertTriangle, CheckCircle, Mail, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export default function HelpPage() {
  const { demoLogin, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does SafePay Guardian decide whether a payment is high risk?',
      answer: 'SafePay Guardian uses an Machine Learning Isolation Forest model combined with behavioral rules. It inspects factors such as transfer amount variance, time of day, recipient UPI/account novelty, device fingerprints, and rapid transfer velocity to calculate a risk score between 0 and 100.'
    },
    {
      question: 'What happens when my payment is marked as "PENDING GUARDIAN APPROVAL"?',
      answer: 'When a payment score exceeds the high-risk threshold (70+), funds remain safely frozen in your wallet. A real-time notification is sent instantly to your linked Family Guardian (e.g. your son or daughter). Once they review and click "Approve", the payment completes instantly.'
    },
    {
      question: 'How do I link a Family Guardian to my account?',
      answer: 'Navigate to the Guardians page (/guardians), click "+ Add Guardian", and enter your family member’s email address along with their relationship (Son, Daughter, Caregiver). Once linked, they will receive approvals for any flagged payments.'
    },
    {
      question: 'Can a Guardian steal my money or initiate transfers on their own?',
      answer: 'No! Guardians only possess authorization to review and either approve or block OUTGOING payments that you initiate. Guardians cannot transfer money out of your account or access your private payment methods.'
    },
    {
      question: 'What should I do if I am being pressured or coerced by a caller?',
      answer: 'If anyone claiming to be a bank officer, police official, or tech support tells you to urgently transfer money, stop immediately! Do not share OTPs. SafePay Guardian will automatically freeze large unknown transfers and notify your family guardian.'
    },
    {
      question: 'Is SafePay Guardian using real money in this demonstration?',
      answer: 'No, SafePay Guardian is currently running in a safe interactive demo mode. All wallet balances, accounts, and payments are virtual simulations designed to showcase real-time scam interception architecture.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-black uppercase tracking-wider"
          >
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span>Support & Help Center</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900"
          >
            How can we help you <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              stay safe online?
            </span>
          </motion.h1>

          {/* Search Input Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="absolute left-4 top-6 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search help topics (e.g. risk score, guardian hold, UPI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200/80 shadow-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all font-medium text-sm"
            />
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <Link
            href="/send-money"
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-emerald-500/40 transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-600">Send Money Help</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">Guide on initiating payments and handling warnings.</p>
            </div>
          </Link>

          <Link
            href="/guardians"
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-sky-500/40 transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-sky-600">Guardian Management</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">How to add, remove, and configure family guardians.</p>
            </div>
          </Link>

          <Link
            href="/security"
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:border-purple-500/40 transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-purple-600">Security Stack</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">Deep dive into ML risk scores and encryption.</p>
            </div>
          </Link>

        </div>

        {/* FAQs Accordion List */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left font-extrabold text-base text-slate-900 flex items-center justify-between gap-4 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-4 font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instant Demo Persona Launcher */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase text-blue-600">Interactive Demo Launcher</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">Want to test how Guardian approvals work?</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">Switch between Elderly user, Guardian, and Admin with 1 click.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => demoLogin('elderly@safepay.demo')}
              className="px-4 py-2.5 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 font-bold text-xs transition-all"
            >
              👵 Elderly Demo
            </button>
            <button
              onClick={() => demoLogin('guardian@safepay.demo')}
              className="px-4 py-2.5 rounded-xl bg-sky-100 text-sky-700 border border-sky-200 hover:bg-sky-200 font-bold text-xs transition-all"
            >
              🛡️ Guardian Demo
            </button>
            <button
              onClick={() => demoLogin('admin@safepay.demo')}
              className="px-4 py-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 font-bold text-xs transition-all"
            >
              👑 Admin Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
