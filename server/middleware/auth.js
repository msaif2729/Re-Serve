const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'reserve_secret_jwt_key_2026';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authMiddleware, JWT_SECRET };
