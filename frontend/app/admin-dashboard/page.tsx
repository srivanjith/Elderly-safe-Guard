'use client';

import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, ShieldAlert, Users, DollarSign, PieChart as PieIcon, BarChart3, Lock, Server } from 'lucide-react';
import api from '../../lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users')
      ]);

      if (analyticsRes.data.success) {
        setMetrics(analyticsRes.data.metrics);
        setCharts(analyticsRes.data.charts);
        setActivity(analyticsRes.data.recentActivity || []);
      }

      if (usersRes.data.success) {
        setUsersList(usersRes.data.users || []);
      }
    } catch (err) {
      console.error('[AdminDashboard] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 uppercase tracking-wider">
            Fintech System Administration
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            SafePay Guardian Analytics
          </h1>
          <p className="text-slate-600 text-base mt-1">
            Real-time fraud statistics, ML risk distribution, and guardian resolution metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all"
          >
            Refresh Metrics
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-[#e6fcf5] border border-[#b2f5ea] shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Fraud Prevented</span>
          <div className="mt-3">
            <span className="text-3xl font-bold text-emerald-700">₹{metrics?.totalFraudPreventedAmount?.toLocaleString() || '0'}</span>
            <span className="block text-xs text-emerald-800 font-semibold mt-1">Saved from scams</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#edf2ff] border border-[#bac8ff] shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total System Users</span>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">{metrics?.totalUsers || 0}</span>
            <span className="block text-xs text-blue-700 font-semibold mt-1">
              {metrics?.totalElderlyUsers || 0} Elderly • {metrics?.totalGuardians || 0} Guardians
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#e7f5ff] border border-[#a5d8ff] shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evaluated Transfers</span>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">{metrics?.totalTransactions || 0}</span>
            <span className="block text-xs text-sky-800 font-semibold mt-1">
              {metrics?.completedTransactions || 0} Completed • {metrics?.pendingTransactions || 0} Held
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#fff0f6] border border-[#ffc9c9] shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blocked Scams</span>
          <div className="mt-3">
            <span className="text-3xl font-bold text-rose-600">{metrics?.blockedCount || 0}</span>
            <span className="block text-xs text-rose-700 font-semibold mt-1">Intercepted & Cancelled</span>
          </div>
        </div>

      </div>

      {/* Recharts Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Risk Distribution Pie Chart */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <PieIcon className="w-6 h-6 text-blue-600" />
            <span>Transactions by Risk Level</span>
          </h3>

          <div className="h-64 w-full">
            {charts?.riskDistribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.riskDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-bold">Chart loading...</div>
            )}
          </div>
        </div>

        {/* Guardian Resolution Ratio Bar Chart */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span>Guardian Resolution Ratio</span>
          </h3>

          <div className="h-64 w-full">
            {charts?.guardianResolutionRatio ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.guardianResolutionRatio}>
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-bold">Chart loading...</div>
            )}
          </div>
        </div>

      </div>

      {/* Users Management Table */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
        <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          <span>System Users Directory</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 rounded-l-xl">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Wallet Balance</th>
                <th className="p-4 rounded-r-xl">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-900">{u.name}</td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'ELDERLY_USER' ? 'bg-blue-100 text-blue-700 border border-blue-200' : u.role === 'GUARDIAN' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-purple-100 text-purple-700 border border-purple-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 font-black text-slate-900">₹{u.walletBalance?.toLocaleString()}</td>
                  <td className="p-4 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
    </div>
  );
}
