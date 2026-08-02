import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Utensils, HeartHandshake, ShieldCheck, CheckCircle2, AlertCircle, Lock, Mail, User, Phone, MapPin, Link as LinkIcon, Compass } from 'lucide-react';

export default function Register() {
  const { register, verifyFssaiLicense } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('donor'); // 'donor' | 'ngo'
  const [coords, setCoords] = useState([28.6139, 77.2090]); // [lat, lng] Default New Delhi
  const [extractedNotice, setExtractedNotice] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_no: '',
    fssai_license: '',
    address_text: '',
    address_map_link: '',
    operational_hours: '09:00 AM - 10:00 PM',
    food_preference: 'Cooked Meals',
    contact_person: '',
    reg_no: '',
    fcra_reg_no: ''
  });

  const [fssaiVerified, setFssaiVerified] = useState(false);
  const [fssaiChecking, setFssaiChecking] = useState(false);
  const [fssaiError, setFssaiError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to extract Lat and Lng from Google Maps URL or coordinates string
  const extractCoordsFromUrl = (urlStr) => {
    if (!urlStr) return null;
    const match = urlStr.match(/(?:q=|@|ll=)?(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'fssai_license') {
      setFssaiVerified(false);
      setFssaiError('');
    }
  };

  // Dedicated handler for Google Maps URL resolution (handles short links like https://maps.app.goo.gl/...)
  const handleMapUrlChange = async (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      address_map_link: value,
      address_text: value // set address_text from map link
    }));

    if (!value) {
      setExtractedNotice('');
      return;
    }

    // Try direct regex extraction first
    const directCoords = extractCoordsFromUrl(value);
    if (directCoords) {
      setCoords(directCoords);
      setExtractedNotice(`✓ Coordinates Extracted: Lat ${directCoords[0].toFixed(4)}, Lng ${directCoords[1].toFixed(4)}`);
      return;
    }

    // If shortened maps.app.goo.gl link, resolve with backend redirect expansion engine
    if (value.includes('goo.gl') || value.includes('maps.app') || value.includes('http')) {
      setExtractedNotice('⏳ Resolving Google Maps link coordinates...');
      try {
        const res = await API.post('/auth/resolve-map-url', { url: value });
        if (res.data?.success && res.data?.coords) {
          const resCoords = res.data.coords;
          setCoords(resCoords);
          setExtractedNotice(`✓ Shortened Google Maps Link Resolved: Lat ${resCoords[0].toFixed(4)}, Lng ${resCoords[1].toFixed(4)}`);
        } else {
          setExtractedNotice('⚠️ Could not extract coordinates from link');
        }
      } catch (err) {
        console.warn('Map URL resolution error:', err);
        setExtractedNotice('⚠️ Could not resolve shortened Google Maps link');
      }
    }
  };

  const handleVerifyFssaiClick = async () => {
    if (!formData.fssai_license || formData.fssai_license.length !== 14) {
      setFssaiError('Please enter a valid 14-digit FSSAI license number.');
      return;
    }
    setFssaiChecking(true);
    setFssaiError('');
    const res = await verifyFssaiLicense(formData.fssai_license, formData.name);
    setFssaiChecking(false);
    if (res.valid || res.success) {
      setFssaiVerified(true);
    } else {
      setFssaiError(res.message || 'Invalid FSSAI License number.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'donor' && !fssaiVerified) {
      setError('You must verify your 14-digit FSSAI license before completing Donor registration.');
      return;
    }

    setLoading(true);
    const result = await register({
      ...formData,
      address_text: formData.address_map_link || `${formData.name} Location`,
      role,
      latitude: coords[0],
      longitude: coords[1],
      address_map_link: formData.address_map_link || `https://maps.google.com/?q=${coords[0]},${coords[1]}`
    });
    setLoading(false);

    if (result.success) {
      if (role === 'donor') {
        navigate('/donor-dashboard');
      } else {
        navigate('/ngo-dashboard');
      }
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Join Re-Serve Network</h1>
          <p className="text-slate-400 text-sm">Select your role and enter your organization details</p>

          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 mt-4">
            <button
              type="button"
              onClick={() => {
                setRole('donor');
                setError('');
              }}
              className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${role === 'donor'
                  ? 'gradient-btn text-white'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Surplus Donor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('ngo');
                setError('');
              }}
              className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${role === 'ngo'
                  ? 'gradient-btn text-white'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Verified NGO</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
              {role === 'donor' ? 'Business / Restaurant Name' : 'NGO / Shelter Name'}
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder={role === 'donor' ? 'e.g. Grand Hyatt Catering' : 'e.g. Annamrita Foundation'}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@organization.org"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone_no"
              required
              value={formData.phone_no}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* GOOGLE MAPS URL FIELD WITH AUTOMATIC SHORT LINK RESOLUTION & LAT/LNG EXTRACTION */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <label className="block text-xs uppercase font-bold text-slate-300 flex items-center space-x-1">
              <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Maps URL Link (Full or Shortened maps.app.goo.gl)</span>
            </label>
            <input
              type="text"
              name="address_map_link"
              required
              value={formData.address_map_link}
              onChange={handleMapUrlChange}
              placeholder="e.g. https://maps.app.goo.gl/JxhZgkuzK9ayRNjV6 or https://maps.google.com/?q=18.9543,72.8168"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
            />

            {extractedNotice ? (
              <p className="text-[11px] font-mono text-emerald-400 font-bold pt-1">{extractedNotice}</p>
            ) : (
              <p className="text-[10px] text-slate-400">
                Paste any Google Maps link (including short links like maps.app.goo.gl) to extract location coordinates automatically.
              </p>
            )}
          </div>

          {/* DONOR SPECIFIC FIELDS: FSSAI License */}
          {role === 'donor' && (
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-bold text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>14-Digit FSSAI License Number</span>
                </label>
                {fssaiVerified && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED</span>
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  name="fssai_license"
                  required
                  maxLength={14}
                  value={formData.fssai_license}
                  onChange={handleChange}
                  placeholder="e.g. 10019011000123"
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyFssaiClick}
                  disabled={fssaiChecking}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex-shrink-0"
                >
                  {fssaiChecking ? 'Checking...' : 'Verify FSSAI'}
                </button>
              </div>

              {fssaiError && <p className="text-xs text-red-400">{fssaiError}</p>}
            </div>
          )}

          {/* NGO SPECIFIC FIELDS */}
          {role === 'ngo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Contact Person Name</label>
                <input
                  type="text"
                  name="contact_person"
                  required
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Dr. Sunita Sharma"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-400 mb-1">NGO Registration No.</label>
                <input
                  type="text"
                  name="reg_no"
                  required
                  value={formData.reg_no}
                  onChange={handleChange}
                  placeholder="NGO-882910"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full py-4 rounded-2xl font-extrabold text-base pt-3 shadow-xl"
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'donor' ? 'Food Donor' : 'NGO Partner'}`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 font-bold hover:underline">
            Log In here
          </Link>
        </p>
      </div>
    </div>
  );
}
