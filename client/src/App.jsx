import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VoiceWidget from './components/VoiceWidget';

// 21 Page Components
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Demo from './pages/Demo';

import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import SignOut from './pages/auth/SignOut';

import DonorDashboard from './pages/donor/DonorDashboard';
import DonateStep1 from './pages/donor/DonateStep1';
import DonateStep2 from './pages/donor/DonateStep2';
import DonorForm from './pages/donor/DonorForm';

import NgoDashboard from './pages/ngo/NgoDashboard';
import FoodListing from './pages/food/FoodListing';
import FoodDetail from './pages/food/FoodDetail';

import Dashboard from './pages/Dashboard';
import OrderList from './pages/orders/OrderList';
import DonorOrderDetails from './pages/orders/DonorOrderDetails';
import NgoOrderDetails from './pages/orders/NgoOrderDetails';

import SpeechAssistant from './pages/utilities/SpeechAssistant';
import TestDistance from './pages/utilities/TestDistance';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public & Marketing Pages (5 Pages) */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/demo" element={<Demo />} />

              {/* Auth Pages (3 Pages) */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-out" element={<SignOut />} />

              {/* Donor Pages (4 Pages) */}
              <Route path="/donor-dashboard" element={<DonorDashboard />} />
              <Route path="/donate" element={<DonateStep1 />} />
              <Route path="/donate2" element={<DonateStep2 />} />
              <Route path="/donor-form" element={<DonorForm />} />

              {/* NGO & Discovery Pages (3 Pages) */}
              <Route path="/ngo-dashboard" element={<NgoDashboard />} />
              <Route path="/food-listing" element={<FoodListing />} />
              <Route path="/products/:id" element={<FoodDetail />} />

              {/* Order & Fulfillment Pages (4 Pages) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/order" element={<OrderList />} />
              <Route path="/order-details" element={<DonorOrderDetails />} />
              <Route path="/ngo-order-details" element={<NgoOrderDetails />} />

              {/* Utility Pages (2 Pages) */}
              <Route path="/speech" element={<SpeechAssistant />} />
              <Route path="/testDistance" element={<TestDistance />} />
            </Routes>
          </main>

          <VoiceWidget />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
