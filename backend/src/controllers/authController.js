const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

/**
 * Handle Agent login
 */
async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the agent exists
    const queryText = 'SELECT * FROM agents WHERE username = $1';
    const result = await db.query(queryText, [username.trim().toLowerCase()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password.' 
      });
    }

    const agent = result.rows[0];

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, agent.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password.' 
      });
    }

    // Generate JWT token (expires in 24 hours)
    const token = jwt.sign(
      { 
        id: agent.id, 
        username: agent.username, 
        name: agent.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      agent: {
        id: agent.id,
        username: agent.username,
        name: agent.name
      }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error occurred during login. Please try again.' 
    });
  }
}

module.exports = {
  login
};
