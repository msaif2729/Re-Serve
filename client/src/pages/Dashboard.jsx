import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'donor') {
      navigate('/donor-dashboard');
    } else if (user?.role === 'ngo') {
      navigate('/ngo-dashboard');
    } else {
      navigate('/food-listing');
    }
  }, [user, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p>Routing to your role dashboard...</p>
    </div>
  );
}
