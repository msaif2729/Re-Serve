# 🍲 Re-Serve: Surplus Food Redistribution & Zero-Waste Platform

> **Re-Serve** is an AI-powered surplus food redistribution ecosystem connecting **FSSAI-verified Food Business Operators (Donors)** with **Registered NGO Relief Organizations** to rescue surplus meals, eliminate food waste, and combat hunger with real-time tracking.

---

## 🌟 Key Features

### 🤖 Gemini 1.5 Flash AI Freshness Inspection
- Automated AI vision quality scanning on uploaded food photos.
- Analyzes freshness grade, calculates safety scores (%), and estimates remaining shelf-life hours before listing approval.
- Rejects food listings flagged with spoilage hazard risks.

### 🛡️ FSSAI License & Regulatory Verification
- Real-time 14-digit FSSAI (Food Safety and Standards Authority of India) license verification for donors.
- Ensures all food donations originate from compliant commercial kitchens and food business operators.

### 🔑 6-Digit Secret OTP Physical Handover
- Secure physical verification workflow: NGOs receive a unique 6-digit OTP upon claiming surplus food.
- Donors verify the secret code on-site before physical release to guarantee audit integrity and prevent unauthorized pickups.

### 📍 Interactive Proximity Map & Geospatial Routing
- Leaflet map integration displaying live surplus pins sorted by distance radius (km).
- Turn-by-turn route mapping between NGO hubs and donor kitchens.
- Privacy mode: Location distance features and detailed maps are reserved for authenticated accounts.

### 📄 Tax Exemption Receipt PDF Generator
- Automated 1-click PDF certificate generation for completed food donations.
- Includes donor FSSAI details, NGO registration number, item quantities, and fair market valuation for tax exemption records.

### 🎙️ Hands-Free Voice AI Form Dictation
- Voice speech-to-text integration for quick surplus food posting and pickup window scheduling.

---

## 🛠️ Tech Stack

### **Frontend (`/client`)**
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS with custom Glassmorphism system
- **Icons**: Lucide React
- **Maps**: Leaflet & React-Leaflet
- **Real-Time**: Socket.io-client
- **PDF Generation**: jsPDF & html2canvas

### **Backend (`/server`)**
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ODM
- **Real-Time Communication**: Socket.io
- **AI Integration**: Google Generative AI SDK (`@google/genai` - Gemini 1.5 Flash)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs

---

## 📁 Project Architecture

```
re-serve/
├── client/                      # React Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI Components (Navbar, MapView, CertificateGenerator, etc.)
│   │   ├── context/             # AuthContext & ThemeContext
│   │   ├── pages/               # Application Route Pages (Donor, NGO, Food, Auth)
│   │   ├── services/            # Axios API client & Socket instance
│   │   └── index.css            # Tailored Tailwind theme & Glassmorphism utilities
│   └── package.json
│
├── server/                      # Node.js & Express Backend API
│   ├── config/                  # MongoDB Database Connection
│   ├── controllers/             # Auth, Food, Order, Donor, NGO, & AI Controllers
│   ├── middleware/              # JWT Auth & Multer Image Upload Middleware
│   ├── models/                  # Mongoose Schemas (User, Donor, NGO, DonorForm, Order)
│   ├── routes/                  # Express API Route Handlers
│   ├── utils/                   # Distance math calculation & FSSAI verifier
│   └── server.js                # Express App Entry & Socket.io Server Setup
│
└── README.md
```

---

## 🚀 Getting Started & Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or MongoDB Atlas cluster)

---

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment configuration (.env)
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:
```bash
npm start
# Server runs on http://localhost:5000
```

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
# App runs on http://localhost:3000
```
---

## 📜 License
This project is licensed under the MIT License.
