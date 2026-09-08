'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, ShieldAlert, Send, CheckCircle, AlertTriangle, Clock, RefreshCw, Smartphone, Check, Plus } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../lib/authContext';
import { getSocket } from '../../lib/socket';

export default function SendMoneyPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [recipientName, setRecipientName] = useState('MedPlus Pharmacy');
  const [recipientId, setRecipientId] = useState('medplus@safepay');
  const [amount, setAmount] = useState<string>('5000');
  const [note, setNote] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [beneficiaryStatus, setBeneficiaryStatus] = useState<'KNOWN' | 'NEW'>('KNOWN');
  const [transactionType, setTransactionType] = useState('Bill payment');
  const [transactionTime, setTransactionTime] = useState('10:30 AM');
  const [deviceChanged, setDeviceChanged] = useState(false);

  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Prefill sender details from authenticated user
  useEffect(() => {
    if (user) {
      if (!senderName) setSenderName(user.name || 'Senior Account Holder');
      if (!senderPhone) setSenderPhone(user.phone || '+91 98765 43210');
    } else {
      if (!senderName) setSenderName('Senior Account Holder');
      if (!senderPhone) setSenderPhone('+91 98765 43210');
    }
  }, [user]);

  // Transaction Outcome Modal States
  const [holdModal, setHoldModal] = useState<{ open: boolean; transaction: any }>({ open: false, transaction: null });
  const [successModal, setSuccessModal] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Update recipientId based on status toggle and name
  useEffect(() => {
    const handleSlug = recipientName ? recipientName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'payee';
    if (beneficiaryStatus === 'NEW') {
      setRecipientId(`${handleSlug}_new_${Date.now().toString().slice(-4)}@safepay`);
    } else {
      setRecipientId(`${handleSlug}@safepay`);
    }
  }, [beneficiaryStatus, recipientName]);

  // Quick risk preview calculation as user fills form
  const handleAnalyzeRisk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    const amtNum = parseFloat(amount);

    if (!recipientName || !amtNum || amtNum <= 0) {
      setError('Please enter beneficiary name and a valid transaction amount.');
      return;
    }

    setEvaluating(true);
    try {
      const res = await api.post('/transactions/123/analyze', {
        amount: amtNum,
        recipientId: recipientId || 'medplus@safepay',
        deviceChanged: deviceChanged || beneficiaryStatus === 'NEW'
      });
      if (res.data.success) {
        setRiskAssessment(res.data.assessment);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    const amtNum = parseFloat(amount);
    if (!amtNum || amtNum <= 0 || !recipientName) {
      setRiskAssessment(null);
      return;
    }

    const timer = setTimeout(() => {
      handleAnalyzeRisk();
    }, 400);

    return () => clearTimeout(timer);
  }, [amount, recipientName, beneficiaryStatus, deviceChanged]);

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

    if (!recipientName || !recipientId || !senderName || !senderPhone || !amtNum || amtNum <= 0) {
      setError('Please fill in all sender details, beneficiary details, and a valid amount.');
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
        senderName,
        senderPhone,
        amount: amtNum,
        note: note ? `[${transactionType}] ${note}` : `[${transactionType}] Payment`,
        deviceChanged: deviceChanged || beneficiaryStatus === 'NEW'
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
    <div className="min-h-screen bg-[#f6f9fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold font-mono tracking-wider text-slate-500 uppercase block mb-1">
              (b) · TRANSACTION SAFETY CHECK
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Make a transaction
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Every transfer is analyzed against your simulated 30-day behavior baseline before it can proceed.
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="self-start sm:self-center px-4 py-2 rounded-full bg-white border border-slate-200/90 text-slate-700 font-bold text-xs shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to overview</span>
          </button>
        </div>

        {/* Main Card: Transaction Details */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Transaction details</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Use sample details to test different risk outcomes.</p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Form Grid 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-base font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5000"
                    className="w-full pl-9 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-slate-900 font-bold text-base focus:outline-none focus:border-[#2a276e] transition-all placeholder:text-slate-400"
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-400 mt-1.5 block">
                  Typical range: ₹1,000—₹25,000
                </span>
              </div>

              {/* Beneficiary Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Beneficiary name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="MedPlus Pharmacy"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-slate-900 font-bold text-base focus:outline-none focus:border-[#2a276e] transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Beneficiary Status Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Beneficiary status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBeneficiaryStatus('KNOWN')}
                    className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      beneficiaryStatus === 'KNOWN'
                        ? 'bg-[#2a276e] border-[#2a276e] text-white shadow-md'
                        : 'bg-[#f8fafc] border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Known</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBeneficiaryStatus('NEW')}
                    className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      beneficiaryStatus === 'NEW'
                        ? 'bg-[#2a276e] border-[#2a276e] text-white shadow-md'
                        : 'bg-[#f8fafc] border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>New</span>
                  </button>
                </div>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Transaction type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:border-[#2a276e] transition-all"
                >
                  <option value="Bill payment">Bill payment</option>
                  <option value="P2P Transfer">P2P Transfer</option>
                  <option value="Merchant Purchase">Merchant Purchase</option>
                  <option value="Emergency Medical">Emergency Medical</option>
                  <option value="High Risk Wire / Investment">High Risk Wire / Investment</option>
                </select>
              </div>

              {/* Transaction Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Transaction time</label>
                <input
                  type="text"
                  value={transactionTime}
                  onChange={(e) => setTransactionTime(e.target.value)}
                  placeholder="10:30 AM"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-slate-900 font-bold text-base focus:outline-none focus:border-[#2a276e] transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Optional Transaction Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Optional transaction note</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What is this for?"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-slate-900 font-medium text-sm focus:outline-none focus:border-[#2a276e] transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Sender Account Details Section */}
              <div className="md:col-span-2 pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Sender account details
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400">
                    Verified Account Holder
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sender Account Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Sender account name</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Enter sender account name"
                      className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-slate-900 font-bold text-base focus:outline-none focus:border-[#2a276e] transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Sender Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Sender phone number</label>
                    <input
                      type="text"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-slate-900 font-bold text-base focus:outline-none focus:border-[#2a276e] transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Device Toggle & Wallet Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#f8fafc] border border-slate-200">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="deviceToggle"
                  checked={deviceChanged}
                  onChange={(e) => setDeviceChanged(e.target.checked)}
                  className="w-5 h-5 accent-[#2a276e] rounded cursor-pointer"
                />
                <label htmlFor="deviceToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Simulate New Unrecognized Device (Triggers ML anomaly flag)
                </label>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                <span>Wallet: <strong className="text-emerald-600 font-black">₹{user?.walletBalance?.toLocaleString()}</strong></span>
                <button
                  type="button"
                  onClick={async () => {
                    const amtStr = prompt('Enter Allowance Amount to request from Guardian (₹):', '10000');
                    if (!amtStr) return;
                    const amt = parseFloat(amtStr);
                    if (!amt || amt <= 0) return;
                    const noteStr = prompt('Enter Purpose Note:', 'Monthly Expenses') || 'Allowance';
                    try {
                      const res = await api.post('/users/request-funds', { amount: amt, note: noteStr });
                      if (res.data.success) {
                        alert(res.data.message || `📩 Fund request for ₹${amt.toLocaleString()} sent to Guardian!`);
                        if (refreshUser) refreshUser();
                      }
                    } catch {
                      alert('Request failed');
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                >
                  + Request Funds
                </button>
              </div>
            </div>

            {/* Analyze & Confirm Action Button */}
            <button
              type="submit"
              disabled={submitting || evaluating}
              className="w-full py-4 rounded-2xl bg-[#2a276e] hover:bg-[#201d58] text-white font-black text-base shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-purple-300" />
                  <span>Analyze & Confirm Transaction</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Risk Analysis Card */}
        <div className="p-8 rounded-3xl bg-[#e8f7ff] border border-[#baeafe] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">AI risk analysis</h3>
            <span className="px-3.5 py-1 rounded-full bg-white border border-sky-300 text-sky-700 font-mono text-xs font-extrabold flex items-center gap-1 shadow-sm">
              <span className="animate-pulse text-sky-500">~</span> Simulated engine
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            The AI recommends a safety response; it never makes an irreversible decision independently.
          </p>

          {/* Live Telemetry Data */}
          {riskAssessment ? (
            <div className="p-5 rounded-2xl bg-white border border-sky-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-500">Live Machine Learning Output</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                  riskAssessment.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700 border-rose-300' : riskAssessment.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                }`}>
                  {riskAssessment.riskLevel} RISK • SCORE {riskAssessment.riskScore}/100
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    riskAssessment.riskLevel === 'HIGH' ? 'bg-rose-500' : riskAssessment.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${riskAssessment.riskScore}%` }}
                />
              </div>

              <ul className="space-y-1 pt-1">
                {riskAssessment.reasons?.map((r: string, idx: number) => (
                  <li key={idx} className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                    <span className="text-blue-600">✓</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/70 border border-sky-200 text-xs font-bold text-slate-500 text-center">
              Fill in transaction details above to compute live behavioral risk scoring.
            </div>
          )}
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

