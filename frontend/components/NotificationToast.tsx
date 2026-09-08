'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { getSocket } from '../lib/socket';
import { useAuth } from '../lib/authContext';

interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'HIGH_RISK' | 'APPROVED' | 'BLOCKED' | 'EXPIRED';
}

export const NotificationToast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { user } = useAuth();

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    const handleHighRisk = (data: any) => {
      if (user.role === 'GUARDIAN') {
        const newToast: ToastItem = {
          id: Math.random().toString(),
          title: '⚠️ Suspicious Transaction Alert',
          message: `${data.userName || 'Elderly user'} initiated ₹${data.amount?.toLocaleString()} to ${data.recipientName}. Risk: ${data.riskScore}/100`,
          type: 'HIGH_RISK'
        };
        setToasts(prev => [newToast, ...prev]);
      }
    };

    const handleApproved = (data: any) => {
      const newToast: ToastItem = {
        id: Math.random().toString(),
        title: '✅ Payment Approved',
        message: `Simulated payment of ₹${data.amount?.toLocaleString()} to ${data.recipientName} was approved by guardian.`,
        type: 'APPROVED'
      };
      setToasts(prev => [newToast, ...prev]);
    };

    const handleBlocked = (data: any) => {
      const newToast: ToastItem = {
        id: Math.random().toString(),
        title: '🛑 Payment Intercepted & Blocked',
        message: `High-risk transfer of ₹${data.amount?.toLocaleString()} to ${data.recipientName} was blocked to prevent scam.`,
        type: 'BLOCKED'
      };
      setToasts(prev => [newToast, ...prev]);
    };

    const handleExpired = (data: any) => {
      const newToast: ToastItem = {
        id: Math.random().toString(),
        title: '⌛ Transaction Expired',
        message: data.message || 'Transaction expired due to guardian approval timeout (10 mins).',
        type: 'EXPIRED'
      };
      setToasts(prev => [newToast, ...prev]);
    };

    socket.on('transaction:high-risk', handleHighRisk);
    socket.on('transaction:approved', handleApproved);
    socket.on('transaction:blocked', handleBlocked);
    socket.on('transaction:expired', handleExpired);

    return () => {
      socket.off('transaction:high-risk', handleHighRisk);
      socket.off('transaction:approved', handleApproved);
      socket.off('transaction:blocked', handleBlocked);
      socket.off('transaction:expired', handleExpired);
    };
  }, [user]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100 }}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-start gap-4 ${
              toast.type === 'HIGH_RISK'
                ? 'bg-rose-950/90 text-white border-rose-600 backdrop-blur-md'
                : toast.type === 'APPROVED'
                ? 'bg-emerald-950/90 text-white border-emerald-600 backdrop-blur-md'
                : toast.type === 'BLOCKED'
                ? 'bg-slate-900/90 text-white border-rose-500 backdrop-blur-md'
                : 'bg-amber-950/90 text-white border-amber-500 backdrop-blur-md'
            }`}
          >
            <div className="mt-0.5">
              {toast.type === 'HIGH_RISK' && <ShieldAlert className="w-7 h-7 text-rose-400 animate-bounce" />}
              {toast.type === 'APPROVED' && <CheckCircle className="w-7 h-7 text-emerald-400" />}
              {toast.type === 'BLOCKED' && <XCircle className="w-7 h-7 text-rose-400" />}
              {toast.type === 'EXPIRED' && <AlertCircle className="w-7 h-7 text-amber-400" />}
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-base tracking-wide">{toast.title}</h4>
              <p className="text-sm text-slate-200 mt-1">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
