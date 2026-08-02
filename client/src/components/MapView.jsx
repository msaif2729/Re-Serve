import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Clock, Utensils } from 'lucide-react';

const donorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ngoIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    }
  });
  return null;
}

export default function MapView({
  center = [28.6139, 77.2090], // Default New Delhi
  zoom = 13,
  markers = [], // Array of { id, title, coords: [lat, lng], type: 'donor' | 'ngo', details: {} }
  polyline = null, // Optional [[lat1, lng1], [lat2, lng2]]
  onMapClick = null
}) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative group">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[350px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

        {/* Render Pins */}
        {markers.map((m, idx) => (
          <Marker
            key={m.id || idx}
            position={m.coords}
            icon={m.type === 'ngo' ? ngoIcon : donorIcon}
          >
            <Popup className="custom-popup">
              <div className="p-1 max-w-xs">
                <div className="flex items-center space-x-1.5 font-bold text-sm text-emerald-400 mb-1">
                  <Utensils className="w-4 h-4" />
                  <span>{m.title}</span>
                </div>
                {m.type && (
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold mb-2 ${
                    m.type === 'donor' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {m.type}
                  </span>
                )}
                {m.details?.serves && (
                  <p className="text-xs text-slate-300">
                    🍱 <strong>Quantity:</strong> {m.details.serves} servings
                  </p>
                )}
                {m.details?.preferred_pickup_time && (
                  <p className="text-xs text-slate-300 mt-1">
                    ⏰ <strong>Pickup:</strong> {m.details.preferred_pickup_time}
                  </p>
                )}
                {m.details?.address && (
                  <p className="text-xs text-slate-400 mt-1">
                    📍 {m.details.address}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Optional Route Line */}
        {polyline && (
          <Polyline
            positions={polyline}
            pathOptions={{ color: '#10b981', weight: 4, dashArray: '8, 8' }}
          />
        )}
      </MapContainer>
    </div>
  );
}
