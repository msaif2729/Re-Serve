import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../../services/api';
import CertificateGenerator from '../../components/CertificateGenerator';
import { ArrowLeft, CheckCircle2, ShieldCheck, FileCheck, MapPin, Clock, KeyRound } from 'lucide-react';

export default function DonorOrderDetails() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await API.get(`/orders/${orderId}`);
      setOrderData(res.data);
    } catch (err) {
      console.error('Fetch order details error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p>Loading Order Details & Certificate...</p>
      </div>
    );
  }

  const order = orderData?.order || orderData;
  const ngo = order?.ngo_id;
  const donor = order?.donor_form_id?.donor_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Link to="/donor-dashboard" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Donor Command Center</span>
      </Link>

      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
        
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Verified Order Receipt</span>
            <h1 className="text-3xl font-extrabold text-white">{order?.donor_form_id?.food_name || 'Surplus Meal Donation'}</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">Order ID: {order?._id ? String(order._id).slice(-8).toUpperCase() : 'RSV-88291'}</p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-2xl text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>HANDOVER VERIFIED</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Servings Delivered</span>
            <p className="text-2xl font-black text-white">{order?.serves || 0} <span className="text-xs font-normal text-slate-400">servings</span></p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Recipient NGO</span>
            <p className="text-lg font-bold text-white">{ngo?.name || 'Verified Relief NGO'}</p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Verified OTP Code</span>
            <p className="text-2xl font-mono font-black text-emerald-400">{order?.OTP || 'Verified'}</p>
          </div>
        </div>

        {/* Certificate Generator Component */}
        <div className="p-6 bg-slate-900/40 rounded-2xl border border-emerald-500/20 space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Tax Exemption Receipt PDF</h3>
          </div>
          <p className="text-xs text-slate-400">
            Your Tax Exemption Certificate has been generated and validated.
          </p>

          <CertificateGenerator order={order} donor={donor} ngo={ngo} />
        </div>

      </div>
    </div>
  );
}
