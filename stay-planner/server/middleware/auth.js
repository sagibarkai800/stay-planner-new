const jwt = require('jsonwebtoken');
const { findUserById } = require('../db');

const requireAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.auth;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // Set user in request object (remove password_hash for security)
    req.user = {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { requireAuth };
