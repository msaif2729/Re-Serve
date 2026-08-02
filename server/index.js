const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded food photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach Socket.io instance to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// MongoDB Connection with Auto Seed & Fallback
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reserve_db';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    // Run seed if database is empty
    const seedData = require('./seed');
    await seedData();
  })
  .catch(err => {
    console.warn('Local MongoDB connection offline. System running with in-memory fallback active.');
  });

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/donor', require('./routes/donorRoutes'));
app.use('/api/ngo', require('./routes/ngoRoutes'));
app.use('/api/ai', require('./routes/aiRoutes')); // POST /api/ai/assess-quality
app.use('/api', require('./routes/verifyRoutes')); // POST /api/verifyFssai

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Re-Serve Food Redistribution API',
    timestamp: new Date()
  });
});

// Socket.io Real-time Event Listeners
io.on('connection', socket => {
  console.log('⚡ Socket connected:', socket.id);

  socket.on('join', room => {
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Re-Serve backend server running on http://localhost:${PORT}`);
});
