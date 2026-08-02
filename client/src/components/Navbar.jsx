import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Utensils,
  Heart,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Compass,
  Menu,
  X,
  CheckCircle2,
  MapPin,
  FileCheck,
  Sun,
  Moon,
  Info
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Utensils className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight flex items-center">
                Re<span className="gradient-text">-Serve</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-emerald-400 block -mt-1">
                Surplus Food Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${isActive('/')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${isActive('/about')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              About Us
            </Link>

            <Link
              to="/food-listing"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${isActive('/food-listing')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              Food Feed
            </Link>

            <Link
              to="/features"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${isActive('/features')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              Features
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${isActive('/how-it-works')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              How It Works
            </Link>

            {/* LIGHT / DARK MODE TOGGLE BUTTON */}
            {/* <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-xl border border-slate-700/60 hover:bg-slate-800/50 transition-all flex items-center justify-center space-x-1.5 ml-2"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button> */}
          </div>

          {/* User Auth Controls & Role Badges */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={user?.role === 'donor' ? '/donor-dashboard' : user?.role === 'ngo' ? '/ngo-dashboard' : '/dashboard'}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-sm font-semibold text-emerald-400 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Dashboard</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {user?.role || 'User'}
                  </span>
                </Link>

                {user?.role === 'donor' && (
                  <Link
                    to="/donate"
                    className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-1.5"
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Post Surplus</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    navigate('/sign-out');
                  }}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center space-x-1"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-800 text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-200 hover:bg-slate-800"
          >
            About Us
          </Link>
          <Link
            to="/food-listing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-200 hover:bg-slate-800"
          >
            Food Feed
          </Link>
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-200 hover:bg-slate-800"
          >
            Features
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-200 hover:bg-slate-800"
          >
            How It Works
          </Link>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'donor' ? '/donor-dashboard' : '/ngo-dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                >
                  My Dashboard ({user?.role?.toUpperCase()})
                </Link>
                {user?.role === 'donor' && (
                  <Link
                    to="/donate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-semibold text-white gradient-btn text-center"
                  >
                    + Donate Food Now
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/sign-out');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-base font-semibold text-red-400 hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-xl gradient-btn text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
