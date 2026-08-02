import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Utensils, Send, Camera, Upload, Link as LinkIcon, X } from 'lucide-react';

export default function DonorForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [inputMode, setInputMode] = useState('file'); // 'file' | 'url'
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    food_name: 'Assorted Gourmet Pastries & Sandwiches',
    food_type: 'Bakery',
    serves: 50,
    storage: 'Room Temperature',
    hours: 8,
    preferred_pickup_time: 'Ready for Immediate Pickup',
    food_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, food_image: localPreview }));

    const data = new FormData();
    data.append('food_image', file);

    try {
      setUploading(true);
      const res = await API.post('/food/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.imageUrl) {
        setFormData(prev => ({ ...prev, food_image: res.data.imageUrl }));
      }
    } catch (err) {
      console.warn('Fallback to Data URL:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, food_image: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const now = new Date();
    const expiry = new Date(now.getTime() + formData.hours * 3600 * 1000);

    try {
      await API.post('/food', {
        ...formData,
        preparation_date_time: now,
        expiry_date_time: expiry
      });
      navigate('/donor-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Quick submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Utensils className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Express Surplus Donation</h1>
          <p className="text-slate-400 text-sm">Single-page quick donation form with device photo upload</p>
        </div>

        {error && <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Food Name</label>
            <input
              type="text"
              required
              value={formData.food_name}
              onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Food Type</label>
              <select
                value={formData.food_type}
                onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery">Bakery</option>
                <option value="Raw Ingredients">Raw Ingredients</option>
                <option value="Packaged">Packaged</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Servings Count</label>
              <input
                type="number"
                required
                min={1}
                value={formData.serves}
                onChange={(e) => setFormData({ ...formData, serves: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Storage</label>
              <select
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Refrigerated">Refrigerated</option>
                <option value="Room Temperature">Room Temperature</option>
                <option value="Frozen">Frozen</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Fresh Hours Left</label>
              <input
                type="number"
                min={1}
                max={48}
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Preferred Pickup Window</label>
            <input
              type="text"
              required
              value={formData.preferred_pickup_time}
              onChange={(e) => setFormData({ ...formData, preferred_pickup_time: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* DUAL MODE IMAGE SELECTOR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase font-bold text-slate-400">
                Food Photo (Device Upload or Image URL)
              </label>
              <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setInputMode('file')}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    inputMode === 'file' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    inputMode === 'url' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>URL</span>
                </button>
              </div>
            </div>

            {inputMode === 'file' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-5 text-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all space-y-1 group"
                >
                  <Camera className="w-6 h-6 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-white">Click to upload photo from your device</p>
                  <p className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP</p>
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={formData.food_image}
                onChange={(e) => setFormData({ ...formData, food_image: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs font-mono"
              />
            )}
          </div>

          {/* Photo Preview Card */}
          {formData.food_image && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-40">
              <img src={formData.food_image} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, food_image: '' })}
                className="absolute top-2 right-2 p-1.5 bg-slate-950/80 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>{loading ? 'Submitting Quick Form...' : 'Submit Quick Donation'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
