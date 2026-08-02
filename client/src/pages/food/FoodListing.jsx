import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import MapView from '../../components/MapView';
import { useAuth } from '../../context/AuthContext';
import { socket } from '../../services/socket';
import { Search, Filter, MapPin, Clock, Utensils, ArrowRight, ShieldCheck, Sparkles, Zap, Lock, LogIn, UserPlus } from 'lucide-react';

export default function FoodListing() {
  const { isAuthenticated } = useAuth();

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [storage, setStorage] = useState('All');
  const [maxDistance, setMaxDistance] = useState(100); // Default 100km radius / nationwide

  // User / NGO Location state (Default New Delhi, updated from logged in profile or listing center)
  const [userCoords, setUserCoords] = useState([28.6139, 77.2090]);

  useEffect(() => {
    fetchUserProfileAndFood();

    socket.on('food:posted', () => {
      fetchFoodItems(userCoords[0], userCoords[1]);
    });

    return () => {
      socket.off('food:posted');
    };
  }, [category, storage, search, maxDistance]);

  const fetchUserProfileAndFood = async () => {
    let lat = 28.6139;
    let lng = 77.2090;

    if (isAuthenticated) {
      try {
        // Try to fetch logged-in NGO/User profile location
        const resNgo = await API.get('/ngo/dashboard');
        if (resNgo.data?.ngo?.location?.coordinates) {
          const coords = resNgo.data.ngo.location.coordinates;
          // GeoJSON [longitude, latitude]
          lng = coords[0];
          lat = coords[1];
          setUserCoords([lat, lng]);
        }
      } catch (err) {
        console.warn('Could not load NGO profile location:', err);
      }
    }

    fetchFoodItems(lat, lng);
  };

  const fetchFoodItems = async (lat, lng) => {
    try {
      setLoading(true);
      const res = await API.get('/food', {
        params: {
          category,
          storage,
          search,
          maxDistance: isAuthenticated ? maxDistance : 1000,
          lat: lat || userCoords[0],
          lng: lng || userCoords[1]
        }
      });
      setFoodItems(res.data);

      // Auto-center map on first available food item if default coordinates are set
      if (res.data && res.data.length > 0 && isAuthenticated) {
        const firstItemCoords = res.data[0]?.donor_id?.location?.coordinates;
        if (firstItemCoords && Array.isArray(firstItemCoords) && firstItemCoords.length === 2) {
          // GeoJSON format is [lng, lat] -> convert to [lat, lng]
          setUserCoords([firstItemCoords[1], firstItemCoords[0]]);
        }
      }
    } catch (err) {
      console.error('Fetch food listing error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert listings to Map Markers
  const mapMarkers = foodItems.map(item => ({
    id: item._id,
    title: item.food_name,
    coords: item.donor_id?.location?.coordinates
      ? [item.donor_id.location.coordinates[1], item.donor_id.location.coordinates[0]]
      : [userCoords[0], userCoords[1]],
    type: 'donor',
    details: {
      serves: item.serves,
      preferred_pickup_time: item.preferred_pickup_time,
      address: item.donor_id?.name || 'Verified Food FBO'
    }
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center space-x-1.5 w-fit mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 1.5 Flash AI Freshness Inspection Active</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
          Surplus Food <span className="gradient-text">Discovery Feed</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          Browse live surplus meal listings posted by verified FSSAI food business donors.
        </p>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className={`grid grid-cols-1 ${isAuthenticated ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
          
          {/* Search bar */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search paneer, breads..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Bakery">Bakery & Breads</option>
              <option value="Raw Ingredients">Raw Ingredients</option>
              <option value="Packaged">Packaged Goods</option>
            </select>
          </div>

          {/* Storage Filter */}
          <div>
            <select
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="All">All Storage Types</option>
              <option value="Refrigerated">Refrigerated</option>
              <option value="Room Temperature">Room Temp</option>
              <option value="Frozen">Frozen</option>
            </select>
          </div>

          {/* Max Distance Slider ONLY FOR REGISTERED USERS */}
          {isAuthenticated && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                <span>Max Distance Radius:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          )}

        </div>
      </div>

      {/* MAP & LISTINGS DUAL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Food Cards List */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Searching live surplus feed...</span>
            </div>
          ) : foodItems.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl text-slate-500 dark:text-slate-400 space-y-3">
              <Utensils className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Surplus Food Listings Match Filters</h3>
              <p className="text-xs">Try clearing your search query or adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodItems.map((item) => (
                <div
                  key={item._id}
                  className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between group"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.food_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
                      alt={item.food_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        {item.food_type}
                      </div>
                      <div className="bg-teal-500/90 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-black flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Fresh {item.ai_quality_score || 95}%</span>
                      </div>
                    </div>

                    {/* DISTANCE BADGE ONLY SHOWN TO REGISTERED USERS */}
                    {isAuthenticated && (
                      <div className="absolute bottom-3 right-3 bg-emerald-500/90 text-slate-950 px-3 py-1 rounded-full text-xs font-black">
                        {item.distance_km ? `${item.distance_km} km away` : 'Nearby'}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{item.food_name}</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        🏨 <strong>Donor:</strong> {item.donor_id?.name || 'Verified Donor'}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <span>🍱 {item.serves} Servings</span>
                        <span>❄️ {item.storage}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pickup: {item.preferred_pickup_time}</span>
                      </div>

                      <Link
                        to={`/products/${item._id}`}
                        className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 text-white"
                      >
                        <span>View & Claim</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Interactive Map or Lock Box for Unauthenticated Visitors */}
        <div className="lg:col-span-1 h-[550px] sticky top-24">
          <div className="glass-panel p-3 rounded-3xl border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Surplus Pins Map</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                {foodItems.length} active items
              </span>
            </div>

            {isAuthenticated ? (
              <div className="flex-1 rounded-2xl overflow-hidden">
                <MapView center={userCoords} zoom={12} markers={mapMarkers} />
              </div>
            ) : (
              <div className="flex-1 rounded-2xl bg-slate-900/90 p-6 flex flex-col items-center justify-center text-center space-y-4 border border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Lock className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-lg">Proximity Map Locked</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Interactive distance radius map, turn-by-turn pickup routing, and donor GPS coordinates are available for registered users.
                  </p>
                </div>

                <div className="flex flex-col space-y-2 w-full pt-2">
                  <Link
                    to="/login"
                    className="gradient-btn w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 text-white"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Unlock Map & Radius</span>
                  </Link>

                  <Link
                    to="/register"
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register NGO Account</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
