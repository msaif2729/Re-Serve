import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle2, KeyRound, FileCheck, Utensils, ShieldCheck } from 'lucide-react';

export default function OrderList() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders', {
        params: { role: user?.role }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Central Order & Pickup Registry</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">View active claims, OTP codes, and completed deliveries</p>
        </div>

        <Link to="/food-listing" className="gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs">
          + Claim New Food
        </Link>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span>Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
            <Utensils className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-semibold">No order history found for your account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-900/80 text-xs font-bold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Food Item</th>
                  <th className="p-4">Donor / NGO</th>
                  <th className="p-4">Servings</th>
                  <th className="p-4">OTP Status</th>
                  <th className="p-4">Order Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {ord.donor_form_id?.food_name || 'Surplus Meal Package'}
                    </td>
                    <td className="p-4 text-xs font-medium">
                      {user?.role === 'donor'
                        ? `NGO: ${ord.ngo_id?.name || 'Verified Relief NGO'}`
                        : `Donor: ${ord.donor_form_id?.donor_id?.name || 'Verified Donor'}`}
                    </td>
                    <td className="p-4 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {ord.serves} meals
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {user?.role === 'donor' ? (
                        <Link
                          to={`/order-details?id=${ord._id}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold"
                        >
                          Details & OTP
                        </Link>
                      ) : (
                        <Link
                          to={`/ngo-order-details?id=${ord._id}`}
                          className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold"
                        >
                          Pickup Map
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
