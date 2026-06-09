const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'vitto_secret_key_default';

function authenticateAgent(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No authentication token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.agent = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification error:', err.message);
    return res.status(403).json({ 
      success: false, 
      message: 'Failed to authenticate. Token is invalid or expired.' 
    });
  }
}

module.exports = {
  authenticateAgent,
  JWT_SECRET
};
