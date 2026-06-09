const db = require('../config/db');

/**
 * Submit a new loan application (Public)
 * POST /api/applications
 */
async function createApplication(req, res) {
  const { name, mobile, amount, purpose, language } = req.body;

  try {
    const queryText = `
      INSERT INTO applications (name, mobile, amount, purpose, language)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, mobile, amount, purpose, language, status, created_at
    `;
    const values = [name.trim(), mobile.trim(), Number(amount), purpose.trim(), language];
    const result = await db.query(queryText, values);

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully.',
      application: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({
      success: false,
      message: 'Server error. Failed to submit loan application.'
    });
  }
}

/**
 * Retrieve all applications with filters (Agent Only)
 * GET /api/applications
 */
async function getApplications(req, res) {
  const { status, search } = req.query;

  try {
    let queryText = 'SELECT * FROM applications';
    const whereClauses = [];
    const values = [];

    // Filter by status
    if (status) {
      const cleanStatus = status.trim().toLowerCase();
      if (['pending', 'approved', 'rejected'].includes(cleanStatus)) {
        values.push(cleanStatus);
        whereClauses.push(`status = $${values.length}`);
      }
    }

    // Search by name or mobile (case-insensitive)
    if (search && search.trim().length > 0) {
      values.push(`%${search.trim()}%`);
      whereClauses.push(`(name ILIKE $${values.length} OR mobile ILIKE $${values.length})`);
    }

    if (whereClauses.length > 0) {
      queryText += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Order by latest first
    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, values);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      applications: result.rows
    });
  } catch (err) {
    console.error('Error retrieving applications:', err);
    res.status(500).json({
      success: false,
      message: 'Server error. Failed to retrieve applications.'
    });
  }
}

/**
 * Update the status of a loan application (Agent Only)
 * PATCH /api/applications/:id/status
 */
async function updateApplicationStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body; // already validated by middleware to be approved or rejected

  // Simple UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid application ID format.'
    });
  }

  try {
    // Check if application exists
    const checkQuery = 'SELECT id, status FROM applications WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found.'
      });
    }

    // Update status
    const updateQuery = `
      UPDATE applications
      SET status = $1
      WHERE id = $2
      RETURNING id, name, mobile, amount, purpose, language, status, created_at
    `;
    const result = await db.query(updateQuery, [status, id]);

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}.`,
      application: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({
      success: false,
      message: 'Server error. Failed to update application status.'
    });
  }
}

/**
 * Get analytics summary for dashboard (Agent Only)
 * GET /api/summary
 */
async function getSummary(req, res) {
  try {
    // Get total count and total amount
    const mainQuery = `
      SELECT 
        COUNT(*) as total_applications,
        COALESCE(SUM(amount), 0) as total_amount
      FROM applications
    `;
    const mainResult = await db.query(mainQuery);
    const totalApplications = parseInt(mainResult.rows[0].total_applications, 10);
    const totalAmount = parseFloat(mainResult.rows[0].total_amount);

    // Get count per status
    const statusQuery = `
      SELECT status, COUNT(*) as count
      FROM applications
      GROUP BY status
    `;
    const statusResult = await db.query(statusQuery);
    
    // Initialise structure with defaults
    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0
    };

    statusResult.rows.forEach(row => {
      if (statusCounts.hasOwnProperty(row.status)) {
        statusCounts[row.status] = parseInt(row.count, 10);
      }
    });

    res.status(200).json({
      success: true,
      summary: {
        totalApplications,
        totalAmount,
        statusCounts
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({
      success: false,
      message: 'Server error. Failed to retrieve dashboard summary.'
    });
  }
}

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
  getSummary
};
