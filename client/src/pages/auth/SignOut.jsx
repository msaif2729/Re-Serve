import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SignOut() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-white">Signed Out Successfully</h1>
        <p className="text-slate-400 text-sm">
          Thank you for making a difference and helping eliminate surplus food waste!
        </p>

        <div className="pt-4 flex flex-col gap-3">
          <Link to="/login" className="gradient-btn py-3 px-6 rounded-2xl font-bold text-sm">
            Sign Back In
          </Link>
          <Link to="/" className="py-3 px-6 rounded-2xl bg-slate-900 text-slate-300 font-medium text-sm hover:bg-slate-800">
            Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
