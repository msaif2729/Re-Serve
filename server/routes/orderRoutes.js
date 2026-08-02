const express = require('express');
const router = express.Router();
const { claimOrder, verifyOtp, rateOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

router.post('/claim', authMiddleware, claimOrder);
router.post('/verify-otp', authMiddleware, verifyOtp);
router.post('/rate', authMiddleware, rateOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;
