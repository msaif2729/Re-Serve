import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { socket } from '../../services/socket';
import RatingModal from '../../components/RatingModal';
import {
  HeartHandshake,
  KeyRound,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Utensils,
  ShieldCheck,
  Search,
  FileCheck,
  Star,
  History,
  Filter,
  ExternalLink
} from 'lucide-react';

export default function NgoDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // History Filter & Search states
  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'delivered'

  useEffect(() => {
    fetchNgoData();

    socket.on('order:otp_verified', () => {
      fetchNgoData();
    });

    return () => {
      socket.off('order:otp_verified');
    };
  }, []);

  const fetchNgoData = async () => {
    try {
      const res = await API.get('/ngo/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Fetch NGO dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p>Loading NGO Command Center & Rescued Food History...</p>
      </div>
    );
  }

  const { ngo, metrics, orders = [] } = data || {};
  const totalRescued = metrics?.totalMealsRescued ?? 0;
  const activePickups = metrics?.activePickupsCount ?? 0;
  const peopleFedCount = metrics?.peopleFed ?? 0;

  // Filter orders by search & tab status
  const filteredOrders = orders.filter((ord) => {
    const donorName = ord.donor_form_id?.donor_id?.name || '';
    const foodName = ord.donor_form_id?.food_name || '';
    const otpStr = String(ord.OTP || '');

    const query = historySearch.toLowerCase();
    const matchesSearch =
      donorName.toLowerCase().includes(query) ||
      foodName.toLowerCase().includes(query) ||
      otpStr.includes(query);

    if (!matchesSearch) return false;

    if (statusFilter === 'pending') return ord.status === 'pending' || ord.status === 'out_for_pickup';
    if (statusFilter === 'delivered') return ord.status === 'delivered';
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'out_for_pickup').length;
  const completedCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glass-panel p-8 rounded-3xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold text-white">{ngo?.name || 'Registered NGO Partner'}</h1>
            <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>REG NO: {ngo?.reg_no || 'Verified Registration'}</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm">Verified NGO Food Rescue Command Center & Historical Log</p>
        </div>

        <Link
          to="/food-listing"
          className="gradient-btn px-6 py-3.5 rounded-2xl font-extrabold text-sm flex items-center space-x-2 shadow-xl"
        >
          <Search className="w-4 h-4" />
          <span>Browse & Claim Live Surplus Food</span>
        </Link>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Total Meals Rescued</span>
          <p className="text-3xl font-black text-white">{totalRescued} <span className="text-xs font-normal text-slate-400">servings</span></p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Active Scheduled Pickups</span>
          <p className="text-3xl font-black text-amber-400">{activePickups} <span className="text-xs font-normal text-slate-400">orders</span></p>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Estimated People Fed</span>
          <p className="text-3xl font-black text-emerald-400">{peopleFedCount} <span className="text-xs font-normal text-slate-400">people</span></p>
        </div>
      </div>

      {/* RESCUED FOOD CLAIM HISTORY CENTER */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <History className="w-6 h-6 text-emerald-400" />
              <span>Rescued Food Claim History</span>
            </h2>
            <p className="text-xs text-slate-400">Historical audit trail of all food items claimed across different donors.</p>
          </div>

          {/* Tab Filter Switcher */}
          <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
            >
              All Claims ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
            >
              Out for Pickup ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'delivered' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Search Bar for Donor History */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            placeholder="Search by Donor Kitchen Name (e.g. Shalimar), Food Item, or OTP..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 space-y-3">
            <Utensils className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-white">No historical claim records found matching filters.</p>
            <Link to="/food-listing" className="inline-block text-emerald-400 font-bold text-xs hover:underline">
              Explore Live Food Listings →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const donorObj = ord.donor_form_id?.donor_id || {};
              const foodObj = ord.donor_form_id || {};
              const isDelivered = ord.status === 'delivered';

              return (
                <div
                  key={ord._id}
                  className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-lg text-white">
                        {foodObj.food_name || 'Surplus Meal Listing'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDelivered
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        }`}>
                        {isDelivered ? 'Handover Completed' : 'Out For Pickup'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                      <p className="text-slate-300">
                        🏨 <strong>Donor Kitchen:</strong> <span className="text-emerald-400 font-bold">{donorObj.name || 'Donor Kitchen'}</span>
                      </p>
                      <p className="text-slate-300">
                        🍱 <strong>Servings Claimed:</strong> {ord.serves} Servings
                      </p>
                      <p className="text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 inline" />
                        <span><strong>Pickup Window:</strong> {foodObj.preferred_pickup_time || 'Ready for Pickup'}</span>
                      </p>
                      {donorObj.fssai_license && (
                        <p className="text-slate-400">
                          🛡️ <strong>FSSAI License:</strong> <span className="font-mono">{donorObj.fssai_license}</span>
                        </p>
                      )}
                      {donorObj.phone_no && (
                        <p className="text-slate-400">
                          📞 <strong>Donor Contact:</strong> {donorObj.phone_no}
                        </p>
                      )}
                      {ord.created_at && (
                        <p className="text-slate-400">
                          📅 <strong>Claim Date:</strong> {new Date(ord.created_at).toLocaleDateString()} {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Secret OTP Badge */}
                  {!isDelivered ? (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-1 text-center min-w-[170px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                        Secret Pickup OTP
                      </span>
                      <span className="text-2xl font-mono font-black text-emerald-400 tracking-widest">
                        {ord.OTP}
                      </span>
                      <p className="text-[10px] text-slate-500">Provide to donor on site</p>
                    </div>
                  ) : (
                    <div className="bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-500/30 space-y-1 text-center min-w-[170px]">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest flex items-center justify-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>OTP Verified</span>
                      </span>
                      <span className="text-lg font-mono font-bold text-slate-300">
                        Code: {ord.OTP}
                      </span>
                      <p className="text-[10px] text-emerald-400 font-bold">Rescued & Delivered</p>
                    </div>
                  )}

                  <div className="flex flex-col space-y-2 min-w-[150px]">
                    {!isDelivered ? (
                      <Link
                        to={`/ngo-order-details?id=${ord._id}`}
                        className="gradient-btn px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Map Pickup</span>
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedOrderForRating(ord);
                            setShowRatingModal(true);
                          }}
                          className="gradient-btn px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg"
                        >
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>Rate Donor Kitchen</span>
                        </button>
                        <Link
                          to={`/ngo-order-details?id=${ord._id}`}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5"
                        >
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <span>Tax Receipt PDF</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RATING MODAL */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={selectedOrderForRating}
        onSuccess={() => {
          fetchNgoData();
        }}
      />
    </div>
  );
}
