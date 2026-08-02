import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Heart, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-slate-800/60">

          {/* Col 1: Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white">
                Re<span className="gradient-text">-Serve</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bridging the gap between surplus food generators and frontline hunger-relief organizations. Safe, verified, and real-time.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>14-Digit FSSAI License Verified Platform</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform Pages</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us & Mission</Link></li>
              <li><Link to="/features" className="hover:text-emerald-400 transition-colors">Platform Features</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works Workflow</Link></li>
              <li><Link to="/food-listing" className="hover:text-emerald-400 transition-colors">Live Food Feed</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Verification Standards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact & Safety</h3>
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>National Food Safety Hub, New Delhi, India</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <PhoneCall className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>+91 1800-RE-SERVE (Toll Free 24/7)</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>support@re-serve-food.org</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Re-Serve Surplus Food Redistribution Platform. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Zero Food Waste Movement</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
