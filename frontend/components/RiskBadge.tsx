'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, level, showScore = true }) => {
  if (level === 'LOW') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>SAFE {showScore && `• ${score}/100`}</span>
      </span>
    );
  }

  if (level === 'MEDIUM') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <span>CAUTION {showScore && `• ${score}/100`}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20 animate-pulse">
      <ShieldAlert className="w-4 h-4 text-rose-400" />
      <span>HIGH RISK {showScore && `• ${score}/100`}</span>
    </span>
  );
};

