import React, { useState } from 'react';
import API from '../services/api';
import CertificateGenerator from '../components/CertificateGenerator';
import OtpModal from '../components/OtpModal';
import { ShieldCheck, KeyRound, FileCheck, CheckCircle2, Play, Sparkles } from 'lucide-react';

export default function Demo() {
  const [fssaiInput, setFssaiInput] = useState('10019011000123');
  const [fssaiResult, setFssaiResult] = useState(null);
  const [fssaiLoading, setFssaiLoading] = useState(false);

  const [otpModalOpen, setOtpModalOpen] = useState(false);

  const handleTestFssai = async () => {
    setFssaiLoading(true);
    setFssaiResult(null);
    try {
      const res = await API.post('/verifyFssai', { fssai_license: fssaiInput });
      setFssaiResult(res.data);
    } catch (err) {
      setFssaiResult({ success: false, message: 'FSSAI Verification error: ' + (err.response?.data?.message || err.message) });
    } finally {
      setFssaiLoading(false);
    }
  };

  const sampleOrder = {
    _id: '6a679ab11f8e4a5ecc9cfd3d',
    serves: 120,
    OTP: '482910',
    status: 'delivered',
    created_at: new Date().toISOString(),
    donor_form_id: { food_name: 'Surplus Banquet Buffet (Rice, Paneer Gravy, Dal Makhani)' }
  };

  const sampleDonor = { name: 'Grand Hyatt Catering', fssai_license: '10019011000123' };
  const sampleNgo = { name: 'Annamrita Foundation', reg_no: 'NGO-882910' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">
          Interactive Platform Sandbox
        </span>
        <h1 className="text-4xl font-black text-white">
          Live System <span className="gradient-text">Feature Demonstrator</span>
        </h1>
        <p className="text-slate-300 text-sm">
          Test core features live: FSSAI 14-digit validation API, numeric OTP pickup verification modal, and tax PDF generator.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Module 1: FSSAI API Tester */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">1. FSSAI License Validation API</h3>
              <p className="text-xs text-slate-400">POST /api/verifyFssai Endpoint Test</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs uppercase font-bold text-slate-400">Enter 14-Digit FSSAI License No.</label>
            <div className="flex space-x-2">
              <input
                type="text"
                maxLength={14}
                value={fssaiInput}
                onChange={(e) => setFssaiInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleTestFssai}
                disabled={fssaiLoading}
                className="gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{fssaiLoading ? 'Testing...' : 'Test API'}</span>
              </button>
            </div>
          </div>

          {fssaiResult && (
            <div className={`p-4 rounded-2xl border text-xs font-mono space-y-1 ${
              fssaiResult.valid || fssaiResult.success
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/40 border-red-500/30 text-red-300'
            }`}>
              <div className="font-bold uppercase text-[10px] text-slate-400">API Response:</div>
              <div>status: {fssaiResult.valid || fssaiResult.success ? '200 OK (VALID)' : '400 (INVALID)'}</div>
              <div>message: "{fssaiResult.message}"</div>
              {fssaiResult.verificationDetails && (
                <div>state_code: "{fssaiResult.verificationDetails.stateCode}" | type: "{fssaiResult.verificationDetails.businessType}"</div>
              )}
            </div>
          )}
        </div>

        {/* Module 2: OTP Handover Modal Tester */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">2. OTP Verification Protocol</h3>
              <p className="text-xs text-slate-400">POST /api/orders/verify-otp Modal</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Click below to open the interactive numeric OTP entry modal used by donors on site to verify physical handover.
          </p>

          <button
            onClick={() => setOtpModalOpen(true)}
            className="gradient-btn px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg"
          >
            <KeyRound className="w-4 h-4" />
            <span>Launch OTP Verification Modal</span>
          </button>
        </div>

      </div>

      {/* Module 3: PDF Certificate Generator */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">3. Tax Exemption Certificate PDF Generator</h3>
            <p className="text-xs text-slate-400">jsPDF & html2canvas Digital Certificate Renderer</p>
          </div>
        </div>

        <div className="max-w-md">
          <CertificateGenerator order={sampleOrder} donor={sampleDonor} ngo={sampleNgo} />
        </div>
      </div>

      <OtpModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        orderId={sampleOrder._id}
        onSuccess={() => {
          alert('OTP Verification Success! Real-time socket order:otp_verified event broadcasted.');
        }}
      />

    </div>
  );
}
