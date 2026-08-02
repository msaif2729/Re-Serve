const express = require('express');
const router = express.Router();
const { getDonorDashboard } = require('../controllers/donorController');
const { authMiddleware } = require('../middleware/auth');

router.get('/dashboard', authMiddleware, getDonorDashboard);

module.exports = router;
