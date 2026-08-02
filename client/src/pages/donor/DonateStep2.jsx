import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Clock, Shield, MapPin, CheckCircle2, ArrowLeft, Send, Building, Mic, MicOff, Sparkles } from 'lucide-react';

export default function DonateStep2() {
  const navigate = useNavigate();
  const step1Data = JSON.parse(sessionStorage.getItem('donorStep1') || '{}');

  const [storage, setStorage] = useState('Refrigerated');
  const [hoursRemaining, setHoursRemaining] = useState(6);
  const [preferredPickup, setPreferredPickup] = useState('11:00 PM - 12:30 AM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [donorProfile, setDonorProfile] = useState(null);

  // Voice Dictation State
  const [voiceDictating, setVoiceDictating] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');

  // Default location New Delhi coordinates
  const [coords, setCoords] = useState([28.6139, 77.2090]);

  // Automatically load registered donor profile location coordinates & address
  useEffect(() => {
    fetchRegisteredDonorLocation();
  }, []);

  const fetchRegisteredDonorLocation = async () => {
    try {
      const res = await API.get('/donor/dashboard');
      if (res.data?.donor) {
        setDonorProfile(res.data.donor);
        const geoCoords = res.data.donor.location?.coordinates;
        if (geoCoords && Array.isArray(geoCoords) && geoCoords.length === 2) {
          // GeoJSON format is [longitude, latitude], convert to [latitude, longitude]
          setCoords([geoCoords[1], geoCoords[0]]);
        }
      }
    } catch (err) {
      console.warn('Could not load donor profile location:', err);
    }
  };

  const startVoiceDictationStep2 = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setVoiceDictating(true);
      setVoiceNote('Listening... Dictate pickup time (e.g. "Pickup between 10 PM and midnight")');
    };

    recognition.onresult = (event) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setVoiceNote(text);

      if (event.results[0].isFinal) {
        setPreferredPickup(text);
        setVoiceNote(`✨ Pickup Window Set by Voice: "${text}"`);
      }
    };

    recognition.onerror = (e) => {
      setVoiceDictating(false);
      setVoiceNote('Voice dictation error: ' + e.error);
    };

    recognition.onend = () => {
      setVoiceDictating(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!step1Data.food_name) {
      navigate('/donate');
      return;
    }

    setLoading(true);
    setError('');

    const now = new Date();
    const expiry = new Date(now.getTime() + hoursRemaining * 3600 * 1000);

    try {
      const payload = {
        ...step1Data,
        storage,
        preparation_date_time: now,
        expiry_date_time: expiry,
        preferred_pickup_time: preferredPickup,
        latitude: coords[0],
        longitude: coords[1]
      };

      const res = await API.post('/food', payload);
      sessionStorage.removeItem('donorStep1');
      navigate('/donor-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit food listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">

        {/* Step Indicator Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-emerald-400">
            <span>Step 2 of 2: Shelf Life & Final Handover Setup</span>
            <span>100% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Shelf Life & Pickup Window</h1>
            <p className="text-slate-400 text-sm">Configure storage timeline and preferred pickup hours.</p>
          </div>
          <button
            onClick={() => navigate('/donate')}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 flex items-center space-x-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Step 1</span>
          </button>
        </div>

        {error && <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl">{error}</p>}

        {/* Registered Pickup Location Info */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Registered Pickup Location</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold uppercase">
              Auto-Selected
            </span>
          </div>
          <p className="text-sm font-bold text-white">
            {donorProfile?.address_text || donorProfile?.name || 'Registered Kitchen Location'}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Location Coordinates: Lat {coords[0].toFixed(4)}, Lng {coords[1].toFixed(4)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Storage Condition</label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Refrigerated">Refrigerated (2°C - 8°C)</option>
                <option value="Room Temperature">Room Temperature</option>
                <option value="Frozen">Frozen (-18°C)</option>
                <option value="Cold Storage">Cold Storage Unit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                Fresh Shelf Life (Hours Remaining)
              </label>
              <input
                type="number"
                min={1}
                max={72}
                value={hoursRemaining}
                onChange={(e) => setHoursRemaining(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase font-bold text-slate-400">Preferred Pickup Window</label>
              <button
                type="button"
                onClick={startVoiceDictationStep2}
                disabled={voiceDictating}
                className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center space-x-1"
              >
                {voiceDictating ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                <span>{voiceDictating ? 'Listening...' : '🎙️ Dictate Time'}</span>
              </button>
            </div>

            {voiceNote && (
              <p className="text-[11px] text-teal-300 font-mono bg-teal-950/40 p-2 rounded-xl border border-teal-500/20">
                {voiceNote}
              </p>
            )}

            <input
              type="text"
              required
              value={preferredPickup}
              onChange={(e) => setPreferredPickup(e.target.value)}
              placeholder="e.g. 10:30 PM - 12:00 AM tonight"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center space-x-2 shadow-xl"
          >
            <Send className="w-5 h-5" />
            <span>{loading ? 'Publishing Food Listing...' : 'Publish Surplus Food Listing'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
