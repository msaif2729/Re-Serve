const express = require('express');
const router = express.Router();
const { getNgoDashboard } = require('../controllers/ngoController');
const { authMiddleware } = require('../middleware/auth');

router.get('/dashboard', authMiddleware, getNgoDashboard);

module.exports = router;
