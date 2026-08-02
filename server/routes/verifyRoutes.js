const express = require('express');
const router = express.Router();
const { verifyFssai } = require('../controllers/verifyController');

// POST /api/verifyFssai - Validates 14-digit food safety numbers
router.post('/verifyFssai', verifyFssai);

module.exports = router;
