import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../../services/api';
import MapView from '../../components/MapView';
import CertificateGenerator from '../../components/CertificateGenerator';
import { KeyRound, Navigation, PhoneCall, Clock, MapPin, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function NgoOrderDetails() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchNgoOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchNgoOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders/${orderId}`);
      setOrder(res.data.order || res.data);
    } catch (err) {
      console.error('Fetch NGO order detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading Pickup Route & Tax Receipt...</p>
      </div>
    );
  }

  const foodItem = order?.donor_form_id || {};
  const donor = foodItem.donor_id || {};
  const donorCoords = donor.location?.coordinates
    ? [donor.location.coordinates[1], donor.location.coordinates[0]]
    : [28.6139, 77.2090];

  const ngoCoords = order?.ngo_id?.location?.coordinates
    ? [order.ngo_id.location.coordinates[1], order.ngo_id.location.coordinates[0]]
    : [28.6250, 77.2150];

  const isDelivered = order?.status === 'delivered';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link to="/ngo-dashboard" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to NGO Command Center</span>
      </Link>

      {/* Secret OTP Highlight Card */}
      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 text-center space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
          {isDelivered ? 'Physical Handover Verified' : 'Physical Handover Secret Verification Code'}
        </span>

        <div className="p-6 bg-slate-950 rounded-2xl border border-emerald-500/30 inline-block px-12">
          <span className="text-4xl font-mono font-black text-emerald-400 tracking-[0.25em]">
            {order?.OTP || 'Verified'}
          </span>
        </div>

        <p className="text-xs text-slate-300 max-w-md mx-auto">
          {isDelivered
            ? '✅ Handover Completed! Secret OTP was verified on-site by the donor staff.'
            : 'Show or speak this numeric 6-digit OTP code to the donor staff upon physical arrival to verify pickup.'}
        </p>
      </div>

      {/* Tax Exemption Receipt Component (If delivered) */}
      {isDelivered && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Tax Exemption Receipt PDF</h3>
          </div>
          <p className="text-xs text-slate-400">
            Your Tax Exemption Certificate for this donation has been generated and validated.
          </p>

          <CertificateGenerator order={order} donor={donor} ngo={order?.ngo_id} />
        </div>
      )}

      {/* Pickup Details & Donor Info */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">{foodItem.food_name || 'Surplus Meal Listing'}</h2>
            <p className="text-xs text-slate-400">Quantity: {order?.serves} servings | Storage: {foodItem.storage}</p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            isDelivered ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            Status: {order?.status}
          </span>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
          <p className="font-bold text-white text-sm">🏨 Donor Kitchen: {donor.name || 'Donor Kitchen'}</p>
          <p>📞 Phone Contact: {donor.phone_no || 'N/A'}</p>
          <p>⏰ Preferred Pickup Window: {foodItem.preferred_pickup_time || 'Ready now'}</p>
          {donor.address_map_link && (
            <p>📍 Address Link: <a href={donor.address_map_link} target="_blank" rel="noreferrer" className="text-emerald-400 underline font-mono">Open Google Maps Link</a></p>
          )}
        </div>

        {/* Turn-by-Turn Map */}
        <div className="space-y-2">
          <label className="block text-xs uppercase font-bold text-slate-400 flex items-center space-x-1">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Turn-by-Turn Route from NGO Hub to Donor Kitchen</span>
          </label>
          <div className="h-72 rounded-2xl overflow-hidden border border-slate-800">
            <MapView
              center={donorCoords}
              zoom={13}
              markers={[
                { id: 'donor', title: donor.name || 'Donor Location', coords: donorCoords, type: 'donor' },
                { id: 'ngo', title: order?.ngo_id?.name || 'NGO Shelter Hub', coords: ngoCoords, type: 'ngo' }
              ]}
              polyline={[ngoCoords, donorCoords]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
