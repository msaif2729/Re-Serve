import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { socket } from '../../services/socket';
import OtpModal from '../../components/OtpModal';
import {
  Utensils,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  FileCheck,
  PlusCircle,
  ShieldCheck,
  Leaf,
  MapPin
} from 'lucide-react';

export default function DonorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    // Listen to real-time socket updates for instant sync
    socket.on('order:claimed', () => {
      fetchDashboardData();
    });

    socket.on('order:otp_verified', () => {
      fetchDashboardData();
    });

    return () => {
      socket.off('order:claimed');
      socket.off('order:otp_verified');
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/donor/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Fetch donor dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p>Loading Donor Impact Dashboard & Orders...</p>
      </div>
    );
  }

  const { donor, metrics, postings = [], orders = [] } = data || {};
  const totalMeals = metrics?.totalMealsDonated ?? 0;
  const totalKg = metrics?.kgSaved ?? 0;
  const totalCo2 = metrics?.co2SavedKg ?? 0;

  // Determine badge tier based on actual total meals donated
  let badgeTier = '🌱 New Surplus Partner';
  if (totalMeals >= 500) {
    badgeTier = '🏆 Platinum Impact Leader';
  } else if (totalMeals >= 100) {
    badgeTier = '🥇 Gold Hunger Fighter';
  } else if (totalMeals > 0) {
    badgeTier = '🥈 Silver Hunger Fighter';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header & Impact Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold text-white">{donor?.name || 'Registered Donor Kitchen'}</h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FSSAI VERIFIED: {donor?.fssai_license || 'Verified License'}</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm">Donor Portal & Physical Pickup Verification Command Center</p>
        </div>

        <Link
          to="/donate"
          className="gradient-btn px-6 py-3.5 rounded-2xl font-extrabold text-sm flex items-center space-x-2 shadow-xl"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post New Surplus Food</span>
        </Link>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Meals Donated</span>
            <Utensils className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalMeals} <span className="text-xs font-normal text-slate-400">servings</span></p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Food Waste Saved</span>
            <TrendingUp className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalKg} <span className="text-xs font-normal text-slate-400">kg</span></p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">CO2 Emissions Prevented</span>
            <Leaf className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalCo2} <span className="text-xs font-normal text-slate-400">kg CO2</span></p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Donor Badge Tier</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-lg font-extrabold text-amber-400 flex items-center space-x-1">
            <span>{badgeTier}</span>
          </p>
        </div>
      </div>

      {/* ACTIVE CLAIMS & OTP PICKUP ORDERS */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            <span>Active Orders & OTP Pickup Requests</span>
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
            <Utensils className="w-8 h-8 text-slate-500 mx-auto" />
            <p>No active claim requests right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-lg text-white">
                      {ord.donor_form_id?.food_name || 'Surplus Meal Listing'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${ord.status === 'delivered'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                      {ord.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    🏛️ <strong>Claimed by NGO:</strong> {ord.ngo_id?.name || 'Verified Relief NGO'} ({ord.serves} servings)
                  </p>
                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 inline" />
                    <span><strong>Pickup Window:</strong> {ord.donor_form_id?.preferred_pickup_time || 'Ready for Pickup'}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 inline" />
                    <span><strong>Pickup Location:</strong> {donor?.name || 'Kitchen Hub'}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  {ord.status === 'pending' ? (
                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setShowOtpModal(true);
                      }}
                      className="gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-lg"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Enter Pickup OTP</span>
                    </button>
                  ) : (
                    <Link
                      to={`/order-details?id=${ord._id}`}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>View Tax Receipt PDF</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MY ACTIVE FOOD POSTINGS */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold text-white">Your Posted Surplus Items ({postings.length})</h2>

        {postings.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 space-y-3">
            <p>You haven't posted any surplus food listings yet.</p>
            <Link to="/donate" className="inline-block text-emerald-400 font-bold text-xs hover:underline">
              + Post Your First Food Listing →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {postings.map((p) => (
              <div key={p._id} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <img
                  src={p.food_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
                  alt={p.food_name}
                  className="w-full h-40 object-cover rounded-xl border border-slate-800"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {p.food_type}
                  </span>
                  <h4 className="font-bold text-white text-base mt-1">{p.food_name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">🍱 {p.serves} servings | ❄️ {p.storage}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Expires: {new Date(p.expiry_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={`font-bold uppercase ${p.status === 'available' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        orderId={selectedOrder?._id}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
}
