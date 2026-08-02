import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  Award,
  Users,
  Target,
  Globe,
  MapPin,
  Lock,
  Receipt,
  BarChart3,
  Clock,
  Star,
  CheckCircle2,
  Utensils,
  ArrowRight
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Mission Section */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block">
          Small Changes That Change The Future
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
          About <span className="gradient-text">Re-Serve</span> Network
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
          Re-Serve connects restaurants, hotels, and caterers with surplus food directly to verified recipient NGOs. Reduce food waste while serving those in need through our secure, verified, and real-time platform.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="gradient-btn px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center space-x-2 shadow-xl"
          >
            <span>Start Donating Food</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register?role=ngo"
            className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-extrabold text-sm transition-all"
          >
            <span>Join as NGO Partner</span>
          </Link>
        </div>
      </div>

      {/* Platform Impact Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 glass-panel p-8 rounded-3xl border border-slate-800 text-center">
        <div>
          <p className="text-4xl font-black text-emerald-400 mb-1">2,500+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Meals Delivered</p>
        </div>
        <div>
          <p className="text-4xl font-black text-teal-400 mb-1">150+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Partner Donors</p>
        </div>
        <div>
          <p className="text-4xl font-black text-blue-400 mb-1">75+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">NGO Partners</p>
        </div>
        <div>
          <p className="text-4xl font-black text-purple-400 mb-1">98%</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Satisfaction Rate</p>
        </div>
      </div>

      {/* Why Choose Re-Serve (6 Core Features Grid) */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Why Choose Re-Serve?</h2>
          <p className="text-slate-400 text-sm">Powerful features designed to make food donation seamless, secure, and impactful.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Location-Based Filtering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter surplus food donations based on location and distance radius, ensuring that food reaches the needy quickly in the right place.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Food Safety Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated 14-digit FSSAI license validation and Gemini AI Vision freshness inspection ensure only safe, wholesome food is donated.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">OTP-Based Pickup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secure physical handover process using single-use numeric OTP verification for both donor kitchens and recipient NGOs.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Tax Benefits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic generation of tax-deductible donation receipts, digital certificates, and downloadable PDF impact reports.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Impact Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detailed metrics on meals served, kg of food waste saved, and CO2 emissions prevented from decaying in municipal landfills.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">24/7 Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Round-the-clock assistance and Voice AI companion for both restaurants and NGOs to ensure smooth physical pickup operations.
            </p>
          </div>
        </div>
      </div>

      {/* Community Testimonials */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">What Our Community Says</h2>
          <p className="text-slate-400 text-sm">Real stories from restaurants and NGOs making a difference together.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "Re-Serve has transformed how we source meals for our community shelter. The FSSAI verification process gives us total confidence in food safety, and the real-time map tracking makes pickup coordination effortless."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300">
                SJ
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Sarah Johnson</h4>
                <p className="text-[11px] text-slate-400">Director, Hope Kitchen NGO</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "Instead of throwing away perfectly good banquet surplus, we now serve 50+ meals weekly to nearby shelters. The automatic tax receipt PDF generation makes it incredibly rewarding for our business."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300">
                MR
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Marco Rossi</h4>
                <p className="text-[11px] text-slate-400">Head Chef, Bella Vista Hotel</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "The OTP-based pickup verification system and Voice AI support have streamlined our operations completely. We have increased our weekly food rescue throughput by 200%."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300">
                PS
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Priya Sharma</h4>
                <p className="text-[11px] text-slate-400">Manager, Community Care Foundation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="glass-panel p-10 rounded-3xl border border-emerald-500/30 text-center space-y-4">
        <h2 className="text-3xl font-black text-white">Ready to Make a Difference?</h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Join hundreds of restaurants and recipient NGOs making an impact through Re-Serve. Together, we can serve a meal and change a life.
        </p>
        <div className="pt-2 flex justify-center space-x-4">
          <Link
            to="/register"
            className="gradient-btn px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </div>

    </div>
  );
}
