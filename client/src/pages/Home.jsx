import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Utensils,
  ShieldCheck,
  MapPin,
  Clock,
  HeartHandshake,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Mic,
  Users,
  BarChart3,
  KeyRound,
  Receipt
} from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center space-y-8 relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>FSSAI Verified 14-Digit Surplus Food Network</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Small Changes That Change <br />
            <span className="gradient-text">The Future</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Connect restaurants with surplus food to recipient NGOs and make every meal matter. Reduce food waste while serving those in need with our secure, verified platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/donate"
              className="gradient-btn w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center space-x-2 shadow-2xl shadow-emerald-500/25 group"
            >
              <Utensils className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Donate Surplus Food Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/food-listing"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-emerald-500/40 transition-all flex items-center justify-center space-x-2"
            >
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Explore Food Feed & Map</span>
            </Link>
          </motion.div>
        </div>

        {/* LIVE STATISTICS BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-panel rounded-3xl border border-slate-800"
        >
          <div className="text-center p-4 border-r border-slate-800/80 last:border-0">
            <span className="text-3xl sm:text-4xl font-black text-white gradient-text">2,500+</span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Meals Served</p>
          </div>
          <div className="text-center p-4 border-r border-slate-800/80 last:border-0">
            <span className="text-3xl sm:text-4xl font-black text-white gradient-text">150+</span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Partner Donors</p>
          </div>
          <div className="text-center p-4 border-r border-slate-800/80 last:border-0">
            <span className="text-3xl sm:text-4xl font-black text-white gradient-text">75+</span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">NGO Partners</p>
          </div>
          <div className="text-center p-4">
            <span className="text-3xl sm:text-4xl font-black text-white gradient-text">98%</span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Satisfaction Rate</p>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Four Steps to Zero Food Waste
          </h2>
          <p className="text-slate-400 text-base">
            Engineered for physical food logistics safety, speed, and tax benefit certification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-xl">
              1
            </div>
            <h3 className="text-xl font-bold text-white">Post Surplus</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Donors list available surplus food with quantity, storage parameters, and pickup coordinates.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-xl">
              2
            </div>
            <h3 className="text-xl font-bold text-white">Verification & Match</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated FSSAI checks and Gemini AI Vision freshness inspection ensure food quality compliance.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-xl">
              3
            </div>
            <h3 className="text-xl font-bold text-white">Secure OTP Pickup</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              NGO arrives at donor kitchen and presents a secret numeric OTP to confirm physical handover.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-xl">
              4
            </div>
            <h3 className="text-xl font-bold text-white">Tax Benefits</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automatic generation of tax-deductible donation receipts, digital certificates, and impact reports.
            </p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Powerful Capabilities</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Why Choose Re-Serve?</h2>
              <p className="text-slate-400 text-sm mt-1">Everything you need to make food donation seamless, secure, and impactful.</p>
            </div>
            <Link
              to="/features"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold text-emerald-400 border border-slate-700 flex items-center space-x-2 flex-shrink-0"
            >
              <span>View All Feature Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Food Safety Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated FSSAI checks, AI-powered quality assessment, and freshness verification ensure only safe food is donated.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Impact Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time dashboard insights on meals served, waste reduced, CO2 emissions prevented, and community reach.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">OTP-Based Pickup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Secure pickup process with numeric OTP verification, fraud prevention, and real-time Socket.io state sync.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Tax Benefits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatic generation of tax-deductible donation receipts, annual summaries, and tax-compliant PDF documentation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">24/7 Support & Voice AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Round-the-clock live support, emergency pickup assistance, technical resolution, and hands-free Voice AI companion.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Location Based Filtering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches donations with nearby recipient NGOs, minimizing travel time and promoting hyperlocal community impact.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
