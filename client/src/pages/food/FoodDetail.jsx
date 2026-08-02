import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import MapView from '../../components/MapView';
import { useAuth } from '../../context/AuthContext';
import {
  Utensils,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  KeyRound,
  AlertCircle,
  PhoneCall,
  Calendar
} from 'lucide-react';

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimedOrder, setClaimedOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFoodDetail();
  }, [id]);

  const fetchFoodDetail = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/food/${id}`);
      setFood(res.data);
    } catch (err) {
      console.error('Fetch food detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimFood = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'ngo') {
      setError('Only verified NGOs can claim surplus food. Please log in with an NGO account.');
      return;
    }

    setClaiming(true);
    setError('');

    try {
      const res = await API.post('/orders/claim', {
        donor_form_id: food._id,
        serves: food.serves
      });

      setClaimedOrder(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to claim food item');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 dark:text-slate-400">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="font-semibold">Loading Surplus Listing Details...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 dark:text-slate-400 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Listing Not Found</h2>
        <button onClick={() => navigate('/food-listing')} className="gradient-btn px-6 py-2.5 rounded-xl font-bold text-sm">
          Return to Food Feed
        </button>
      </div>
    );
  }

  const donor = food.donor_id || {};
  const donorCoords = donor.location?.coordinates
    ? [donor.location.coordinates[1], donor.location.coordinates[0]]
    : [28.6139, 77.2090];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Back button */}
      <button
        onClick={() => navigate('/food-listing')}
        className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 flex items-center space-x-1"
      >
        ← Back to Food Feed
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Cols: Main Info & Claim Action */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Image */}
          <div className="relative rounded-3xl overflow-hidden h-80 sm:h-96 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <img
              src={food.food_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80'}
              alt={food.food_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
              {food.food_type}
            </div>

            <div className="absolute bottom-4 right-4 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-xl">
              {food.distance_km ? `${food.distance_km} km away` : 'Nearby'}
            </div>
          </div>

          {/* Title & Specs */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                food.status === 'available' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
              }`}>
                Status: {food.status}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{food.food_name}</h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Servings Available</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{food.serves} meals</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Storage Condition</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{food.storage}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Preparation</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(food.preparation_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Fresh Until</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {new Date(food.expiry_date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-700 dark:text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Claim Action Box */}
            {!claimedOrder ? (
              <div className="pt-2">
                {food.status === 'available' ? (
                  <button
                    onClick={handleClaimFood}
                    disabled={claiming}
                    className="gradient-btn w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center space-x-2 shadow-2xl text-white"
                  >
                    <HeartHandshake className="w-5 h-5" />
                    <span>{claiming ? 'Processing Claim Request...' : 'Claim Surplus Food Now (Generate Secret OTP)'}</span>
                  </button>
                ) : (
                  <div className="p-4 bg-slate-100 dark:bg-slate-900 text-center text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-sm">
                    This surplus food listing has already been claimed by an NGO.
                  </div>
                )}
              </div>
            ) : (
              /* Success Claim Card with Secret OTP */
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-emerald-300 dark:border-emerald-500/40 space-y-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Food Claimed Successfully!</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Your secret physical pickup verification code:
                  </p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-emerald-300 dark:border-emerald-500/30 inline-block px-8 shadow-sm">
                  <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 block">Secret Pickup OTP</span>
                  <span className="text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-widest">
                    {claimedOrder.OTP}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Provide this 6-digit OTP code to the donor upon physical arrival at their premises.
                </p>

                <button
                  onClick={() => navigate('/ngo-dashboard')}
                  className="gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs"
                >
                  Go to NGO Dashboard & Pickup Map
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Donor Profile & FSSAI License Badge */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                🏨
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">{donor.name || 'Verified Donor'}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Verified Food Business Operator</span>
              </div>
            </div>

            {/* FSSAI Badge */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>14-Digit FSSAI License Verified</span>
              </div>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
                License No: {donor.fssai_license || 'Verified License'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Government Govt Food Safety Standard Compliant</p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Operational Hours: {donor.operational_hours || '09:00 AM - 10:00 PM'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Contact: {donor.phone_no || 'N/A'}</span>
              </div>
            </div>

            {/* Location Map */}
            <div className="h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <MapView
                center={donorCoords}
                zoom={14}
                markers={[
                  {
                    id: 'donor_map',
                    title: donor.name || 'Donor Location',
                    coords: donorCoords,
                    type: 'donor',
                    details: { preferred_pickup_time: food.preferred_pickup_time }
                  }
                ]}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
