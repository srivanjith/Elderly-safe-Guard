'use client';

import React, { useEffect, useState } from 'react';
import { Users, Plus, ShieldCheck, Mail, UserPlus, HeartHandshake, CheckCircle } from 'lucide-react';
import api from '../../lib/api';

export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [isPrimary, setIsPrimary] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchGuardians = async () => {
    try {
      const res = await api.get('/guardians');
      if (res.data.success) {
        setGuardians(res.data.guardians || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, []);

  const handleAddGuardian = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await api.post('/guardians', { email, relationship, isPrimary });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setEmail('');
        setShowAddModal(false);
        fetchGuardians();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add guardian.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this trusted guardian?')) return;
    try {
      await api.delete(`/guardians/${id}`);
      fetchGuardians();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove guardian.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf3fe] via-[#f4f8ff] to-[#eaf1fc] text-slate-800 selection:bg-[#2563eb] selection:text-white pl-16 md:pl-24 py-8 font-sans">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <HeartHandshake className="w-8 h-8 text-indigo-600" />
              <span>Trusted Guardians</span>
            </h1>
            <p className="text-slate-600 text-base mt-2">
              Family members or trusted friends who review and approve high-risk payments on your behalf.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <UserPlus className="w-6 h-6" />
            <span>Add New Guardian</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-base font-bold flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Guardians List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-slate-500 font-bold text-lg">Loading guardians...</div>
          ) : guardians.length === 0 ? (
            <div className="col-span-2 py-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-md p-8 space-y-4">
              <Users className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">No Guardians Linked Yet</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Add a trusted son, daughter, spouse, or friend so they can intercept suspicious high-risk payments before funds leave your account.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold"
              >
                Add First Guardian
              </button>
            </div>
          ) : (
            guardians.map((g) => (
              <div
                key={g.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black shrink-0">
                    {g.guardianUser?.name?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-xl">{g.guardianUser?.name}</h3>
                      {g.isPrimary && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-indigo-600 font-bold mt-0.5">{g.relationship}</p>
                    <p className="text-xs text-slate-600 mt-1">{g.guardianUser?.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{g.guardianUser?.phone || 'No phone'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ADD GUARDIAN MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-slate-900">Add Trusted Guardian</h2>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleAddGuardian} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Guardian&apos;s SafePay Email</label>
                  <div className="relative">

                    <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="guardian@safepay.demo"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Family Member">Family Member</option>
                    <option value="Trusted Friend">Trusted Friend</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    id="primary"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600 rounded"
                  />
                  <label htmlFor="primary" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Set as Primary Guardian for high-risk holds
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30"
                >
                  {submitting ? 'Connecting...' : 'Add Guardian'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
