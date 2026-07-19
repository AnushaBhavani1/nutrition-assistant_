// middleware/authMiddleware.js
// Protects routes by verifying the JWT sent in the Authorization header.

const jwt = require('jsonwebtoken');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const User = require('../models/User');

/**
 * Verifies the Bearer token and attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token verification failed');
  }
});

/**
 * Role-ready middleware. Restricts access to the given roles.
 * Usage: router.get('/admin', protect, authorize('admin'), handler)
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Not authorized to access this resource');
  }
  next();
};

module.exports = { protect, authorize };
