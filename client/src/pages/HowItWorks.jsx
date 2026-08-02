import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ShieldCheck, KeyRound, MapPin, CheckCircle2, ArrowRight, FileCheck, Mic } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Redistribution Workflow
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          How <span className="gradient-text">Re-Serve Operates</span>
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          A seamless digital bridge from excess food preparation to secure physical pickup and tax benefit certification.
        </p>
      </div>

      {/* 4 Step Visual Diagram */}
      <div className="space-y-12">
        
        {/* Step 1 */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
              01
            </div>
          </div>
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Step 01 — Food Donor Action</span>
            <h3 className="text-2xl font-bold text-white">Surplus Food Listing & Expiry Configuration</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Donors input food details (servings count, dish title, storage conditions), shelf life expiry window (hours remaining), photo upload, and pinpoint pickup address map coordinates.
            </p>
          </div>
          <div className="lg:col-span-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300 space-y-1">
            <div className="text-slate-400 uppercase font-bold text-[10px]">Data Payload</div>
            <div>food_type: "Cooked Meals"</div>
            <div>serves: 120</div>
            <div>storage: "Refrigerated (4°C)"</div>
            <div>fssai_license: "10019011000123"</div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 to-blue-500 p-0.5 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
              02
            </div>
          </div>
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">Step 02 — Real-Time Discovery</span>
            <h3 className="text-2xl font-bold text-white">Geospatial Distance Matching & Instant NGO Claim</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Verified recipient NGOs within distance radius browse active food listings on live map, evaluate urgency, and click "Claim Food Listing", instantly locking the allocation.
            </p>
          </div>
          <div className="lg:col-span-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-teal-300 space-y-1">
            <div className="text-slate-400 uppercase font-bold text-[10px]">Engine Action</div>
            <div>2dsphere Index: Matched (1.4 km)</div>
            <div>Socket Broadcast: order:claimed</div>
            <div>Status: "pending"</div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-0.5 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
              03
            </div>
          </div>
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Step 03 — Physical Pickup Protocol</span>
            <h3 className="text-2xl font-bold text-white">Numeric OTP Verification at Pickup Kitchen</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The NGO receives a secret 4-6 digit numeric OTP. Upon arriving at the donor's kitchen, the NGO driver presents the code. Donor enters OTP into portal to verify physical handover.
            </p>
          </div>
          <div className="lg:col-span-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-amber-300 space-y-1">
            <div className="text-slate-400 uppercase font-bold text-[10px]">OTP Verification</div>
            <div>secret_otp: "482910"</div>
            <div>POST /api/orders/verify-otp</div>
            <div>Result: 200 OK (Delivered)</div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-1 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
              04
            </div>
          </div>
          <div className="lg:col-span-7 space-y-2">
            <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">Step 04 — Impact & Compliance</span>
            <h3 className="text-2xl font-bold text-white">Automated Tax Certificate & PDF Generation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Once OTP is verified, an official Tax Exemption Certificate and PDF contribution receipt is generated automatically for download.
            </p>
          </div>
          <div className="lg:col-span-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-purple-300 space-y-1">
            <div className="text-slate-400 uppercase font-bold text-[10px]">Document Output</div>
            <div>format: "PDF Document"</div>
            <div>tax_deductible: true</div>
            <div>co2_saved_kg: 120</div>
          </div>
        </div>

      </div>
    </div>
  );
}
