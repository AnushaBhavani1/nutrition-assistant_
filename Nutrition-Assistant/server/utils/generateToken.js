// utils/generateToken.js
// Generates a signed JWT for a given user id.

const jwt = require('jsonwebtoken');

/**
 * @param {string} userId - Mongo ObjectId of the user
 * @returns {string} signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
