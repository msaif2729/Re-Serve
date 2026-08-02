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
  ArrowRight,
  Sparkles,
  Leaf,
  Building2,
  HandHeart,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Mission Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-flex items-center space-x-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Small Changes That Change The Future</span>
        </span>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight">
          Bridging Surplus Food to <span className="gradient-text">Wholesome Meals</span>
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          <strong>Re-Serve</strong> connects restaurants, hotels, and caterers directly with verified recipient NGOs. We eliminate food waste while feeding those in need through AI quality inspection, FSSAI compliance verification, and real-time map logistics.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="gradient-btn px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center space-x-2 shadow-xl text-white"
          >
            <span>Start Donating Food</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/register?role=ngo"
            className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-sm transition-all shadow-sm"
          >
            <span>Join as NGO Partner</span>
          </Link>
        </div>
      </div>

      {/* Platform Impact Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg">
        <div className="space-y-1">
          <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">10,000+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Meals Saved</p>
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-black text-teal-600 dark:text-teal-400">250+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">FSSAI Donors</p>
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-black text-blue-600 dark:text-blue-400">120+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verified NGOs</p>
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-black text-purple-600 dark:text-purple-400">99.4%</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rescue Success</p>
        </div>
      </div>

      {/* Our Mission & Core Vision Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Our Mission</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Every day, tons of fresh, edible commercial food is discarded while millions face hunger. Our mission is to build a transparent, technology-driven redistribution infrastructure that turns surplus food into immediate community nourishment.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Our Vision</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We envision a zero-food-waste future where every commercial kitchen seamlessly connects to local hunger-relief networks, minimizing carbon emissions while ensuring no wholesome meal ever goes to waste.
          </p>
        </div>
      </div>

      {/* Why Choose Re-Serve (6 Core Features Grid) */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why Choose Re-Serve?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Powerful tools designed to make food donation seamless, compliant, and impactful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Geospatial Distance Radius</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time map sorting routes surplus food to the nearest recipient NGOs, guaranteeing fast pickup before shelf-life expiration.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Freshness Inspection</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Gemini 1.5 Flash Vision AI scans food photos to evaluate freshness scores and flag spoilage risks before listings go live.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Secret OTP Verification</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Single-use 6-digit verification codes safeguard physical handovers on-site between donor staff and NGO drivers.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Instant Tax Exemption Receipts</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automatic 1-click PDF certificate generation provides donors with compliant tax deduction documents for every completed pickup.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Environmental Impact Analytics</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Track saved meals, kilograms of food diverted from landfills, and total CO2 greenhouse gas emissions prevented.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Hands-Free Voice AI Companion</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dictate surplus food details and pickup windows hands-free using speech recognition tailored for busy kitchen staff.
            </p>
          </div>
        </div>
      </div>

      {/* Community Testimonials */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">What Our Partners Say</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Real feedback from donors and NGOs making a daily difference.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "Re-Serve has transformed how we source meals for our community shelter. The FSSAI verification process gives us total confidence in food safety, and the real-time map tracking makes pickup coordination effortless."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-300">
                SJ
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Sarah Johnson</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Director, Hope Kitchen NGO</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "Instead of throwing away perfectly good banquet surplus, we now serve 100+ meals weekly to nearby shelters. The automatic tax receipt PDF generation makes it incredibly rewarding for our business."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-300">
                MR
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Marco Rossi</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Head Chef, Grand Catering</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "The OTP-based pickup verification system and Voice AI support have streamlined our operations completely. We have increased our weekly food rescue throughput by 200%."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-300">
                PS
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Priya Sharma</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Manager, Community Care Foundation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="glass-panel p-10 rounded-3xl border border-emerald-500/30 text-center space-y-4 shadow-xl">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Ready to Make an Impact?</h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
          Join hundreds of commercial kitchens and relief NGOs making a tangible difference through Re-Serve.
        </p>
        <div className="pt-2 flex justify-center space-x-4">
          <Link
            to="/register"
            className="gradient-btn px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-lg text-white"
          >
            Get Started Today
          </Link>
        </div>
      </div>

    </div>
  );
}
