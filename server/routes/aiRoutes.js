const express = require('express');
const router = express.Router();
const { assessQuality } = require('../controllers/aiController');

// POST /api/ai/assess-quality - Gemini 1.5 Flash Vision / GPT-4 Vision Endpoint
router.post('/assess-quality', assessQuality);

module.exports = router;
