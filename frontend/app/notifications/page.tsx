'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Check, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import api from '../../lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/all/read');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        <div className="flex items-center justify-between p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <span>Notifications</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1 font-medium">Real-time alerts for high-risk holds and payment status updates.</p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-200"
          >
            <Check className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-bold">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-bold">No notifications.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                  !n.isRead ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="mt-1">
                  {n.type === 'GUARDIAN_APPROVAL_REQUEST' ? (
                    <ShieldAlert className="w-6 h-6 text-rose-600" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-base">{n.title}</h4>
                    <span className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1 font-medium">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
