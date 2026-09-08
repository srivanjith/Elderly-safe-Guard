'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/authContext';
import {
  Home,
  Search,
  Plus,
  MessageSquare,
  User,
  X,
  Sparkles,
  LogOut,
  Bell,
  Shield,
  ArrowRight,
  Send,
  Users,
  History,
  HelpCircle,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import api from '../lib/api';
import { getSocket } from '../lib/socket';

interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search indexing items
  const searchableItems: SearchResultItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      category: 'Page',
      path: user?.role === 'GUARDIAN' ? '/guardian-dashboard' : user?.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard',
      icon: <Home className="w-4 h-4 text-[#a588f7]" />,
      description: 'View balance, real-time AI risk score, and recent activity',
    },
    {
      id: 'send-money',
      title: 'Send Money / Create Transfer',
      category: 'Action',
      path: '/send-money',
      icon: <Send className="w-4 h-4 text-emerald-400" />,
      description: 'Transfer funds securely with AI fraud verification',
    },
    {
      id: 'guardians',
      title: 'Guardian Circle & Contacts',
      category: 'Security',
      path: '/guardians',
      icon: <Users className="w-4 h-4 text-sky-400" />,
      description: 'Manage trusted contacts and secondary approval rules',
    },
    {
      id: 'transactions',
      title: 'Transaction History & Risk Logs',
      category: 'Ledger',
      path: '/transactions',
      icon: <History className="w-4 h-4 text-amber-400" />,
      description: 'Review past money transfers and isolation forest anomaly reasons',
    },
    {
      id: 'notifications',
      title: 'Notifications & Alert Inbox',
      category: 'Inbox',
      path: '/notifications',
      icon: <MessageSquare className="w-4 h-4 text-rose-400" />,
      description: 'Check high-risk warning alerts and guardian responses',
    },
    {
      id: 'security',
      title: 'Security & ML Model Matrix',
      category: 'System',
      path: '/security',
      icon: <Shield className="w-4 h-4 text-[#e2fb42]" />,
      description: 'Inspect Isolation Forest parameters and safety score ranges',
    },
    {
      id: 'features',
      title: 'Platform Features & Capabilities',
      category: 'Explore',
      path: '/features',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      description: 'Explore AI prompt defense, daily limits, and geo-analysis',
    },
    {
      id: 'help',
      title: 'Help & Emergency FAQ Center',
      category: 'Support',
      path: '/help',
      icon: <HelpCircle className="w-4 h-4 text-blue-400" />,
      description: 'Get instant answers for fraud recovery and guardian setup',
    },
    {
      id: 'profile',
      title: 'Profile Settings & Account Details',
      category: 'User',
      path: '/profile',
      icon: <User className="w-4 h-4 text-slate-400" />,
      description: 'Update phone number, email, and notification preferences',
    },
  ];

  const filteredResults = searchQuery.trim()
    ? searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchableItems.slice(0, 5);

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // ignore silently
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const socket = getSocket();

    const handleHighRisk = () => setUnreadCount((prev) => prev + 1);
    const handleStatus = () => setUnreadCount((prev) => prev + 1);

    socket.on('transaction:high-risk', handleHighRisk);
    socket.on('transaction:approved', handleStatus);
    socket.on('transaction:blocked', handleStatus);

    return () => {
      socket.off('transaction:high-risk', handleHighRisk);
      socket.off('transaction:approved', handleStatus);
      socket.off('transaction:blocked', handleStatus);
    };
  }, [user]);

  // Handle global shortcut (Cmd/Ctrl + K to open search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  // Determine active tab index for the left side dock
  // 0: Home, 1: History, 2: Create, 3: Alerts, 4: Saved
  const getActiveTabIndex = () => {
    if (pathname === '/dashboard' || pathname === '/' || pathname === '/guardian-dashboard' || pathname === '/admin-dashboard') return 0;
    if (pathname === '/transactions') return 1;
    if (pathname === '/send-money') return 2;
    if (pathname === '/notifications') return 3;
    if (pathname === '/guardians' || pathname === '/profile') return 4;
    return -1; // Default
  };

  const activeIndex = getActiveTabIndex();

  const handleTabClick = (tabKey: string, targetPath?: string) => {
    if (targetPath) {
      router.push(targetPath);
    }
  };

  const handleSelectResult = (path: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-2 bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 bg-[#0d0d12]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl">
          
          {/* Brand Logo & User Greeting */}
          <div className="flex items-center justify-between w-full md:w-auto px-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#a588f7] via-sky-400 to-[#e2fb42] flex items-center justify-center p-0.5 shadow-md shadow-purple-500/20 group-hover:rotate-45 transition-transform duration-300">
                <div className="w-full h-full bg-[#0b0b10] rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#e2fb42]" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                SafePay<span className="text-[#a588f7]">Guardian</span>
              </span>
            </Link>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {user && (
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right User Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#181822] border border-white/10 hover:border-white/20 transition-all text-xs font-semibold text-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 text-[#a588f7] flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all flex items-center justify-center"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-lime px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#e2fb42]/10"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Floating Vertical Left-Side Navigation Dock with Active Circle Animation */}
      <div className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto relative bg-[#121217] border border-white/10 rounded-3xl py-3 px-1 shadow-[0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col items-center justify-between w-16 md:w-20 h-[360px] md:h-[400px] overflow-hidden">
          
          {/* Animated Glowing Active Circle background */}
          <AnimatePresence mode="wait">
            {activeIndex !== -1 && (
              <motion.div
                key={activeIndex}
                layoutId="activeTabCircle"
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                style={{
                  top: `${activeIndex * 20}%`,
                  height: '20%',
                  width: '100%',
                }}
              >
                {/* Glowing Red Circle surrounding active icon */}
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-red-600/30 via-red-500/20 to-rose-500/10 border border-red-500/60 shadow-[0_0_22px_rgba(239,68,68,0.55),inset_0_0_12px_rgba(239,68,68,0.25)] flex items-center justify-center transition-all duration-300" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. Home Tab */}
          <button
            onClick={() =>
              handleTabClick(
                'home',
                user?.role === 'GUARDIAN'
                  ? '/guardian-dashboard'
                  : user?.role === 'ADMIN'
                  ? '/admin-dashboard'
                  : '/dashboard'
              )
            }
            className={`relative z-10 w-full flex-1 flex flex-col items-center justify-center py-1 transition-all group ${
              activeIndex === 0 ? 'text-red-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center shrink-0">
              <Home className={`w-5 h-5 transition-transform duration-200 ${activeIndex === 0 ? 'text-red-400 scale-110' : 'text-slate-400 group-hover:scale-110'}`} />
            </div>
            <span className={`text-[10px] md:text-[11px] tracking-wide -mt-1 font-medium transition-all ${activeIndex === 0 ? 'text-red-400 font-bold' : ''}`}>Home</span>
          </button>

          {/* 2. History Tab */}
          <button
            onClick={() => handleTabClick('history', '/transactions')}
            className={`relative z-10 w-full flex-1 flex flex-col items-center justify-center py-1 transition-all group ${
              activeIndex === 1 ? 'text-red-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center shrink-0">
              <History className={`w-5 h-5 transition-transform duration-200 ${activeIndex === 1 ? 'text-red-400 scale-110' : 'text-slate-400 group-hover:scale-110'}`} />
            </div>
            <span className={`text-[10px] md:text-[11px] tracking-wide -mt-1 font-medium transition-all ${activeIndex === 1 ? 'text-red-400 font-bold' : ''}`}>History</span>
          </button>

          {/* 3. Create Tab */}
          <button
            onClick={() => handleTabClick('create', '/send-money')}
            className={`relative z-10 w-full flex-1 flex flex-col items-center justify-center py-1 transition-all group ${
              activeIndex === 2 ? 'text-red-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center shrink-0">
              <Plus className={`w-5 h-5 transition-transform duration-200 ${activeIndex === 2 ? 'text-red-400 scale-110' : 'text-slate-400 group-hover:scale-110'}`} />
            </div>
            <span className={`text-[10px] md:text-[11px] tracking-wide -mt-1 font-medium transition-all ${activeIndex === 2 ? 'text-red-400 font-bold' : ''}`}>Create</span>
          </button>

          {/* 4. Notifications Tab (Replaces Inbox) */}
          <button
            onClick={() => handleTabClick('inbox', '/notifications')}
            className={`relative z-10 w-full flex-1 flex flex-col items-center justify-center py-1 transition-all group ${
              activeIndex === 3 ? 'text-red-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center shrink-0 relative">
              <Bell className={`w-5 h-5 transition-transform duration-200 ${activeIndex === 3 ? 'text-red-400 scale-110' : 'text-slate-400 group-hover:scale-110'}`} />
              {/* Unread Count Badge */}
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-[0_0_6px_#ef4444] animate-pulse">
                {unreadCount > 0 ? unreadCount : '!'}
              </span>
            </div>
            <span className={`text-[10px] md:text-[11px] tracking-wide -mt-1 font-medium transition-all ${activeIndex === 3 ? 'text-red-400 font-bold' : ''}`}>Alerts</span>
          </button>

          {/* 5. Saved Tab */}
          <button
            onClick={() => handleTabClick('saved', '/guardians')}
            className={`relative z-10 w-full flex-1 flex flex-col items-center justify-center py-1 transition-all group ${
              activeIndex === 4 ? 'text-red-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center shrink-0">
              <User className={`w-5 h-5 transition-transform duration-200 ${activeIndex === 4 ? 'text-red-400 scale-110' : 'text-slate-400 group-hover:scale-110'}`} />
            </div>
            <span className={`text-[10px] md:text-[11px] tracking-wide -mt-1 font-medium transition-all ${activeIndex === 4 ? 'text-red-400 font-bold' : ''}`}>Saved</span>
          </button>

        </div>
      </div>
    </>
  );
};

