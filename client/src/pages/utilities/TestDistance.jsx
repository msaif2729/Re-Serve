import React, { useState } from 'react';
import MapView from '../../components/MapView';
import { MapPin, Navigation, Compass, ArrowRight } from 'lucide-react';

export default function TestDistance() {
  const [lat1, setLat1] = useState(28.6139); // Donor Delhi
  const [lon1, setLon1] = useState(77.2090);

  const [lat2, setLat2] = useState(28.6250); // NGO Shelter
  const [lon2, setLon2] = useState(77.2150);

  // Haversine formula
  const calculateKm = () => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const distanceKm = calculateKm();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">Geolocation Distance Matrix Tool</h1>
        <p className="text-slate-400 text-sm">
          Tests Haversine spherical distance calculation between donor coordinates and recipient NGO shelter coordinates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="font-extrabold text-white text-lg">Input Coordinates</h3>

          {/* Donor Coordinates */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              📍 Donor Coordinates (Lat / Lng)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.0001"
                value={lat1}
                onChange={(e) => setLat1(Number(e.target.value))}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
              />
              <input
                type="number"
                step="0.0001"
                value={lon1}
                onChange={(e) => setLon1(Number(e.target.value))}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
              />
            </div>
          </div>

          {/* NGO Coordinates */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              🏢 NGO Coordinates (Lat / Lng)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.0001"
                value={lat2}
                onChange={(e) => setLat2(Number(e.target.value))}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
              />
              <input
                type="number"
                step="0.0001"
                value={lon2}
                onChange={(e) => setLon2(Number(e.target.value))}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs"
              />
            </div>
          </div>

          {/* Result Box */}
          <div className="p-6 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-center space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Calculated Geodesic Distance
            </span>
            <span className="text-4xl font-black text-emerald-400 font-mono">
              {distanceKm} km
            </span>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="glass-panel p-3 rounded-3xl border border-slate-800 h-[480px]">
          <MapView
            center={[(lat1 + lat2) / 2, (lon1 + lon2) / 2]}
            zoom={13}
            markers={[
              { id: 'donor', title: 'Donor Location', coords: [lat1, lon1], type: 'donor' },
              { id: 'ngo', title: 'NGO Recipient', coords: [lat2, lon2], type: 'ngo' }
            ]}
            polyline={[[lat1, lon1], [lat2, lon2]]}
          />
        </div>

      </div>
    </div>
  );
}
