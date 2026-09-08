'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Send, ArrowLeft, CheckCircle, AlertTriangle, Clock, RefreshCw, Smartphone } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../lib/authContext';
import { getSocket } from '../../lib/socket';

export default function SendMoneyPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [recipientName, setRecipientName] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState('');
  const [deviceChanged, setDeviceChanged] = useState(false);

  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Transaction Outcome Modal States
  const [holdModal, setHoldModal] = useState<{ open: boolean; transaction: any }>({ open: false, transaction: null });
  const [successModal, setSuccessModal] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Quick risk preview calculation as user fills form
  useEffect(() => {
    const amtNum = parseFloat(amount);
    if (!amtNum || amtNum <= 0 || !recipientId) {
      setRiskAssessment(null);
      return;
    }

    const timer = setTimeout(async () => {
      setEvaluating(true);
      try {
        const res = await api.post('/transactions/123/analyze', {
          amount: amtNum,
          recipientId,
          deviceChanged
        });
        if (res.data.success) {
          setRiskAssessment(res.data.assessment);
        }
      } catch {
        // ignore
      } finally {
        setEvaluating(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [amount, recipientId, deviceChanged]);

  // Socket listener for guardian approval/blocking on held modal
  useEffect(() => {
    if (!holdModal.open || !holdModal.transaction) return;
    const socket = getSocket();

    const handleApproved = (data: any) => {
      if (data.transactionId === holdModal.transaction._id) {
        setHoldModal({ open: false, transaction: null });
        setSuccessModal({ open: true, message: `Payment approved by guardian and completed successfully!` });
        refreshUser();
      }
    };

    const handleBlocked = (data: any) => {
      if (data.transactionId === holdModal.transaction._id) {
        setHoldModal({ open: false, transaction: null });
        alert('🛑 Payment was BLOCKED by your guardian. Funds remain safe in your wallet.');
        router.push('/dashboard');
      }
    };

    socket.on('transaction:approved', handleApproved);
    socket.on('transaction:blocked', handleBlocked);

    return () => {
      socket.off('transaction:approved', handleApproved);
      socket.off('transaction:blocked', handleBlocked);
    };
  }, [holdModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const amtNum = parseFloat(amount);

    if (!recipientName || !recipientId || !amtNum || amtNum <= 0) {
      setError('Please fill in all recipient details and a valid amount.');
      return;
    }

    if (user && user.walletBalance < amtNum) {
      setError(`Insufficient wallet balance. Available: ₹${user.walletBalance.toLocaleString()}`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/transactions', {
        recipientName,
        recipientId,
        amount: amtNum,
        note,
        deviceChanged
      });

      if (res.data.success && res.data.transaction) {
        const tx = res.data.transaction;
        if (tx.status === 'PENDING_GUARDIAN_APPROVAL') {
          setHoldModal({ open: true, transaction: tx });
        } else {
          setSuccessModal({ open: true, message: res.data.message });
          refreshUser();
        }
      }
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Backend server is offline (http://localhost:5000). Please run "npm run dev" from the root folder.');
      } else {
        setError(err.response?.data?.message || 'Payment simulation failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-3xl mx-auto px-4">
        {/* Navigation Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 transition-all hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Simulate Payment Transfer</h1>
            <p className="text-sm font-medium text-slate-600">SafePay Guardian AI Risk Interception</p>
          </div>
        </div>

        {/* Main Payment Form Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-6 relative overflow-hidden">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-extrabold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-extrabold text-slate-700 mb-2">Recipient Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Ravi Kumar"
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-bold text-lg focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Recipient ID */}
            <div>
              <label className="block text-sm font-extrabold text-slate-700 mb-2">Recipient UPI Handle / ID</label>
              <input
                type="text"
                required
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="e.g. ravi@safepay"
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-bold text-lg focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Transfer Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-extrabold text-slate-700">Amount (₹)</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    Available Wallet: <strong className="text-emerald-700 font-black">₹{user?.walletBalance?.toLocaleString()}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      const amtStr = prompt('Enter Allowance Amount to request from Guardian (₹):', '10000');
                      if (!amtStr) return;
                      const amt = parseFloat(amtStr);
                      if (!amt || amt <= 0) return;
                      const note = prompt('Enter Purpose / Note (Optional):', 'Monthly Expenses') || 'Allowance';
                      try {
                        const res = await api.post('/users/request-funds', { amount: amt, note });
                        if (res.data.success) {
                          alert(res.data.message || `📩 Fund request for ₹${amt.toLocaleString()} sent to Guardian!`);
                          if (refreshUser) refreshUser();
                        }
                      } catch (err: any) {
                        alert('Request failed');
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm transition-all"
                  >
                    + Request Funds
                  </button>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-4 text-2xl font-black text-blue-600">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-black text-2xl focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Amount Quick Presets */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-bold text-slate-500 mr-1">Quick Select:</span>
                {[500, 2000, 10000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 border border-slate-200 font-extrabold text-xs transition-all"
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Optional */}
            <div>
              <label className="block text-sm font-extrabold text-slate-700 mb-2">Payment Purpose (Optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. House Rent / Grocery / Emergency"
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium text-base focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Device Change Simulation Checkbox */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-slate-900">Simulate New Device Transfer</span>
                  <span className="text-xs text-slate-500 font-medium">Triggers device change anomaly flag in ML model</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={deviceChanged}
                onChange={(e) => setDeviceChanged(e.target.checked)}
                className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer"
              />
            </div>

            {/* Live AI Risk Assessment Meter */}
            {riskAssessment && (
              <div className={`p-5 rounded-2xl border transition-all ${
                riskAssessment.riskLevel === 'HIGH'
                  ? 'bg-rose-50 border-rose-200'
                  : riskAssessment.riskLevel === 'MEDIUM'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Live AI Risk Telemetry</span>
                  <span className={`text-xs font-black ${
                    riskAssessment.riskLevel === 'HIGH' ? 'text-rose-700' : riskAssessment.riskLevel === 'MEDIUM' ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    {riskAssessment.riskLevel} RISK • SCORE {riskAssessment.riskScore}/100
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${
                      riskAssessment.riskLevel === 'HIGH' ? 'bg-rose-500' : riskAssessment.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${riskAssessment.riskScore}%` }}
                  />
                </div>

                <ul className="space-y-1">
                  {riskAssessment.reasons?.map((r: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                      <span className="text-blue-600">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black text-lg shadow-lg shadow-blue-600/25 flex items-center justify-center gap-3 transition-all disabled:opacity-50 hover:scale-[1.02]"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin text-white" />
                  <span>Evaluating Fraud Engine...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  <span>CONFIRM DEMO PAYMENT</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* HIGH RISK HOLD MODAL */}
        {holdModal.open && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-lg w-full p-8 rounded-3xl bg-white border-2 border-rose-500 shadow-2xl text-center space-y-6">
              
              <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto animate-pulse">
                <ShieldAlert className="w-12 h-12" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200 mb-3">
                  HIGH RISK HOLD ({holdModal.transaction?.riskScore}/100)
                </span>
                <h2 className="text-3xl font-black text-slate-900">Payment Frozen</h2>
                <p className="text-slate-600 text-sm mt-2 font-medium">
                  This transfer triggered high anomaly scoring. It has been safely held and pushed to your Guardian for verification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-extrabold text-slate-900">{holdModal.transaction?.recipientName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-black text-rose-600">₹{holdModal.transaction?.amount?.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-xs font-black text-slate-500 block mb-1">Detected Anomaly Reasons:</span>
                  {holdModal.transaction?.riskReasons?.map((r: string, i: number) => (
                    <p key={i} className="text-xs text-rose-700 font-medium">✓ {r}</p>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center gap-3 text-indigo-700 text-xs font-extrabold">
                <Clock className="w-5 h-5 text-indigo-600 shrink-0 animate-spin" />
                <span>Waiting for Guardian real-time decision...</span>
              </div>

              <button
                onClick={() => {
                  setHoldModal({ open: false, transaction: null });
                  router.push('/dashboard');
                }}
                className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm transition-all border border-slate-200"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS PAYMENT MODAL */}
        {successModal.open && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-emerald-500 shadow-2xl text-center space-y-6">
              
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div>
                <h2 className="text-3xl font-black text-slate-900">Payment Complete</h2>
                <p className="text-slate-600 text-sm mt-2 font-medium">{successModal.message}</p>
              </div>

              <button
                onClick={() => {
                  setSuccessModal({ open: false, message: '' });
                  router.push('/dashboard');
                }}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg shadow-emerald-600/25 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

