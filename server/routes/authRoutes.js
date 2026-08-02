const express = require('express');
const router = express.Router();
const { register, login, me, resolveMapUrl } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/resolve-map-url', resolveMapUrl);
router.get('/me', authMiddleware, me);

module.exports = router;
