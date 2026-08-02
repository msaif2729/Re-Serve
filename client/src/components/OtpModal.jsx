import React, { useState } from 'react';
import API from '../services/api';
import { KeyRound, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function OtpModal({ isOpen, onClose, orderId, onSuccess }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter a valid 4 to 6-digit numeric OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/orders/verify-otp', {
        order_id: orderId,
        otp: Number(otp)
      });

      if (res.data.success) {
        setVerifiedSuccess(true);
        if (onSuccess) onSuccess(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP code. Pickup verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {!verifiedSuccess ? (
          <form onSubmit={handleVerify} className="space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-emerald-400 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Enter Physical Pickup OTP</h3>
              <p className="text-sm text-slate-400 mt-1">
                Ask the collecting NGO for their 6-digit verification code to confirm food handover.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs uppercase font-bold text-slate-400 tracking-wider">
                Numeric Pickup Code (OTP)
              </label>
              <input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="e.g. 482910"
                className="w-full text-center text-2xl font-mono tracking-widest py-3 bg-slate-900 border border-slate-700 rounded-2xl text-emerald-400 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-3.5 px-6 rounded-2xl font-bold text-sm"
            >
              {loading ? 'Verifying OTP Code...' : 'Verify Pickup & Unlock Tax Certificate'}
            </button>

            <p className="text-[11px] text-slate-500 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-time Socket.io physical handover verification</span>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Pickup Verified & Delivered!</h3>
              <p className="text-sm text-slate-300 mt-2">
                Order status has been updated to <strong className="text-emerald-400">Delivered</strong> in real-time. Your tax exemption certificate is ready!
              </p>
            </div>

            <button
              onClick={onClose}
              className="gradient-btn w-full py-3 px-6 rounded-2xl font-bold text-sm"
            >
              Close & View Order Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
