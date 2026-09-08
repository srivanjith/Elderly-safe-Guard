'use client';

import React, { useEffect, useState } from 'react';
import { History, Filter, Search, ArrowUpRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import api from '../../lib/api';
import { RiskBadge } from '../../components/RiskBadge';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchTransactions = async () => {
    try {
      let query = '/transactions?';
      if (filterRisk) query += `riskLevel=${filterRisk}&`;
      if (filterStatus) query += `status=${filterStatus}&`;

      const res = await api.get(query);
      if (res.data.success) {
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterRisk, filterStatus]);

  const filteredList = transactions.filter(t => 
    t.recipientName.toLowerCase().includes(search.toLowerCase()) ||
    t.recipientId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <History className="w-8 h-8 text-blue-600" />
              <span>Transaction Logs</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1 font-medium">Complete audit history of simulated payments & risk engine evaluations.</p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING_GUARDIAN_APPROVAL">Pending Approval</option>
              <option value="CANCELLED">Blocked / Cancelled</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recipient name or handle..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/80 shadow-sm rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 text-sm font-medium"
          />
        </div>

        {/* List */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-bold">Loading transactions...</div>
          ) : filteredList.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-bold">No transactions matching your criteria.</div>
          ) : (
            filteredList.map((tx) => (
              <div
                key={tx._id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center font-black text-lg">
                    ₹
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-lg">{tx.recipientName}</h4>
                    <p className="text-xs text-slate-600 font-medium">
                      {tx.recipientId} • {new Date(tx.createdAt).toLocaleString()}
                    </p>
                    {tx.riskReasons && tx.riskReasons.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">Reasons: {tx.riskReasons.join(', ')}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <RiskBadge score={tx.riskScore} level={tx.riskLevel} />
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900">₹{tx.amount?.toLocaleString()}</span>
                    <span className={`block text-xs font-extrabold ${
                      tx.status === 'COMPLETED' ? 'text-emerald-700' : tx.status === 'PENDING_GUARDIAN_APPROVAL' ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {tx.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
