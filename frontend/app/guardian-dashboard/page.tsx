'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle, XCircle, History } from 'lucide-react';
import api from '../../lib/api';
import { RiskBadge } from '../../components/RiskBadge';
import { getSocket } from '../../lib/socket';

export default function GuardianDashboardPage() {
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal confirmation states
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    type: 'APPROVE' | 'BLOCK' | null;
    transaction: any;
  }>({ open: false, type: null, transaction: null });

  const [processing, setProcessing] = useState(false);

  const fetchPendingAndHistory = async () => {
    try {
      const [pendingRes, historyRes] = await Promise.all([
        api.get('/transactions/guardian/pending'),
        api.get('/transactions')
      ]);

      if (pendingRes.data.success) {
        setPendingList(pendingRes.data.pending || []);
      }

      if (historyRes.data.success) {
        setHistoryList(historyRes.data.transactions || []);
      }
    } catch (err) {
      console.error('[GuardianDashboard] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAndHistory();

    const socket = getSocket();
    const handleHighRisk = () => fetchPendingAndHistory();
    const handleStatus = () => fetchPendingAndHistory();

    socket.on('transaction:high-risk', handleHighRisk);
    socket.on('transaction:approved', handleStatus);
    socket.on('transaction:blocked', handleStatus);

    return () => {
      socket.off('transaction:high-risk', handleHighRisk);
      socket.off('transaction:approved', handleStatus);
      socket.off('transaction:blocked', handleStatus);
    };
  }, []);

  const handleExecuteAction = async () => {
    if (!confirmAction.transaction || !confirmAction.type) return;
    setProcessing(true);

    const txId = confirmAction.transaction._id;
    try {
      if (confirmAction.type === 'APPROVE') {
        const res = await api.post(`/transactions/guardian/transactions/${txId}/approve`);
        if (res.data.success) {
          alert('✅ Payment approved successfully.');
        }
      } else {
        const res = await api.post(`/transactions/guardian/transactions/${txId}/block`);
        if (res.data.success) {
          alert('🛑 Suspicious payment blocked. User funds remain safe.');
        }
      }
      setConfirmAction({ open: false, type: null, transaction: null });
      fetchPendingAndHistory();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed.');
    } finally {
      setProcessing(false);
    }
  };

  const approvedCount = historyList.filter(t => t.guardianDecision === 'APPROVE').length;
  const blockedCount = historyList.filter(t => t.guardianDecision === 'BLOCK').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 uppercase tracking-wider">
            Trusted Guardian Control Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            Pending Approval Queue
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1 font-normal">
            Review high-risk payments intercepted by the AI engine before funds leave your ward&apos;s wallet.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="text-center px-4">
            <span className="block text-2xl font-bold text-emerald-600">{approvedCount}</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-4">
            <span className="block text-2xl font-bold text-rose-600">{blockedCount}</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blocked Scams</span>
          </div>
        </div>
      </div>

      {/* Pending Approval Cards Queue */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-rose-600" />
            <span>High-Risk Payments Awaiting Review ({pendingList.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-bold text-base">Checking pending approvals...</div>
        ) : pendingList.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200/80 shadow-md text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-slate-900">All Clear! No Held Payments</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto font-medium">
              All transactions initiated by your ward are safe or already approved.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingList.map((tx) => (
              <div
                key={tx._id}
                className="p-8 rounded-3xl bg-white border-2 border-rose-300 shadow-md space-y-6 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center font-black text-xl">
                      ⚠️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xl">{tx.senderId?.name || 'Elderly User'}</span>
                        <span className="text-xs font-semibold text-slate-500">initiated payment</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Initiated: {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <RiskBadge score={tx.riskScore} level={tx.riskLevel} />
                    <div className="text-right">
                      <span className="text-3xl font-black text-slate-900">₹{tx.amount?.toLocaleString()}</span>
                      <span className="block text-xs font-black text-rose-600">INTERCEPTED HOLD</span>
                    </div>
                  </div>
                </div>

                {/* Recipient Details & Reasons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Recipient Details</span>
                    <h4 className="font-extrabold text-slate-900 text-lg">{tx.recipientName}</h4>
                    <p className="text-xs text-blue-600 font-mono font-bold">{tx.recipientId}</p>
                    {tx.note && <p className="text-xs text-slate-600 italic font-medium">&quot;{tx.note}&quot;</p>}
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">AI Risk Reasons Flagged</span>
                    <ul className="space-y-1">
                      {tx.riskReasons?.map((reason: string, i: number) => (
                        <li key={i} className="text-xs text-rose-700 font-medium flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">✓</span> {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setConfirmAction({ open: true, type: 'BLOCK', transaction: tx })}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-base shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>BLOCK PAYMENT</span>
                  </button>

                  <button
                    onClick={() => setConfirmAction({ open: true, type: 'APPROVE', transaction: tx })}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>APPROVE PAYMENT</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decision History Table */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <History className="w-6 h-6 text-sky-600" />
          <span>Past Decision History</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 rounded-l-xl">User</th>
                <th className="p-4">Recipient</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Guardian Action</th>
                <th className="p-4 rounded-r-xl">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyList.filter(t => t.guardianDecision).map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{tx.senderId?.name || 'User'}</td>
                  <td className="p-4 font-medium">{tx.recipientName} ({tx.recipientId})</td>
                  <td className="p-4 font-bold text-slate-900">₹{tx.amount?.toLocaleString()}</td>
                  <td className="p-4"><RiskBadge score={tx.riskScore} level={tx.riskLevel} /></td>
                  <td className="p-4">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                      tx.guardianDecision === 'APPROVE'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}>
                      {tx.guardianDecision === 'APPROVE' ? '✓ APPROVED' : '🛑 BLOCKED'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-medium">{new Date(tx.guardianDecisionTime || tx.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {confirmAction.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl text-center space-y-6">
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
              confirmAction.type === 'APPROVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}>
              {confirmAction.type === 'APPROVE' ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Confirm {confirmAction.type === 'APPROVE' ? 'Payment Release' : 'Payment Interception'}
              </h3>
              <p className="text-slate-600 text-sm mt-2 font-medium">
                {confirmAction.type === 'APPROVE'
                  ? `Are you sure you want to release ₹${confirmAction.transaction?.amount?.toLocaleString()} to ${confirmAction.transaction?.recipientName}?`
                  : `Are you sure you want to block this payment of ₹${confirmAction.transaction?.amount?.toLocaleString()} to prevent scam loss?`}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setConfirmAction({ open: false, type: null, transaction: null })}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm transition-all border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                disabled={processing}
                className={`flex-1 py-3.5 rounded-2xl text-white font-black text-sm shadow-lg transition-all ${
                  confirmAction.type === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25'
                }`}
              >
                {processing ? 'Processing...' : 'Confirm Action'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

