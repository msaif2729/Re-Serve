import React from 'react';
import { ShieldCheck, BarChart3, KeyRound, Receipt, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Features() {
  const featureList = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />,
      color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      title: "Food Safety Verification",
      description: "Automated safety checks and quality verification ensure only safe food is donated.",
      bullets: [
        "AI-powered quality assessment",
        "Temperature monitoring alerts",
        "Expiry date verification",
        "Hygiene compliance checks"
      ]
    },
    {
      icon: <BarChart3 className="w-7 h-7 text-red-400" />,
      color: "bg-red-500/10 border-red-500/30 text-red-400",
      title: "Impact Analytics",
      description: "Detailed insights on meals served, waste reduced, and community impact created.",
      bullets: [
        "Real-time impact dashboard",
        "Monthly impact reports",
        "Waste reduction metrics",
        "Community reach analytics"
      ]
    },
    {
      icon: <KeyRound className="w-7 h-7 text-blue-400" />,
      color: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      title: "OTP-Based Pickup",
      description: "Secure pickup process with OTP verification for both restaurants and NGOs.",
      bullets: [
        "Two-factor authentication",
        "SMS and email verification",
        "Fraud prevention measures",
        "Secure handover documentation"
      ]
    },
    {
      icon: <Receipt className="w-7 h-7 text-purple-400" />,
      color: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      title: "Tax Benefits",
      description: "Automatic generation of tax-deductible donation receipts and impact reports.",
      bullets: [
        "Automated receipt generation",
        "Tax-compliant documentation",
        "Annual tax summary reports",
        "Financial impact tracking"
      ]
    },
    {
      icon: <Clock className="w-7 h-7 text-teal-400" />,
      color: "bg-teal-500/10 border-teal-500/30 text-teal-400",
      title: "24/7 Support",
      description: "Round-the-clock support for both restaurants and NGOs to ensure smooth operations.",
      bullets: [
        "Live chat support",
        "Emergency pickup assistance",
        "Technical issue resolution",
        "Training and onboarding help"
      ]
    },
    {
      icon: <MapPin className="w-7 h-7 text-orange-400" />,
      color: "bg-orange-500/10 border-orange-500/30 text-orange-400",
      title: "Location Based Filtering",
      description: "Filter donations based on location, ensuring that the food reaches the needy in the right place.",
      bullets: [
        "Improves delivery efficiency by matching donations with nearby NGOs.",
        "Reduces food waste by minimizing travel time.",
        "Ensures timely pickup and distribution to those in need.",
        "Promotes hyperlocal impact, reaching communities faster and effectively."
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 inline-block">
          Platform Capabilities
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          Powerful <span className="gradient-text">Features</span>
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Everything you need to make food donation seamless, secure, and impactful for everyone involved.
        </p>
      </div>

      {/* Grid of 6 Core Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((f, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl space-y-5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${f.color} group-hover:scale-105 transition-transform`}>
                {f.icon}
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{f.description}</p>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-2 pt-2 border-t border-slate-800/80">
                {f.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action CTA */}
      <div className="glass-panel p-10 rounded-3xl border border-slate-800 text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-white">Ready to Make a Difference?</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Join hundreds of restaurants and NGOs already making an impact through Re-Serve.
        </p>
        <div className="pt-2 flex justify-center space-x-4">
          <Link
            to="/register"
            className="gradient-btn px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
