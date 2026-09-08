'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Wallet, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import api from '../../lib/api';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    try {
      const res = await api.put('/users/profile', { name, phone });
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        refreshUser();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-100 border border-blue-200 text-blue-700 font-black text-3xl flex items-center justify-center">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{user?.name}</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 mt-2">
              <Shield className="w-3.5 h-3.5" />
              {user?.role}
            </span>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Account Settings</h2>

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-bold text-base focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-bold text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Mobile Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-bold text-base focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-lg shadow-blue-600/30"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
