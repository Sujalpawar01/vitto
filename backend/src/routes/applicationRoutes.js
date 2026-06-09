const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateAgent } = require('../middleware/authMiddleware');
const { 
  validateApplicationSubmit, 
  validateStatusUpdate 
} = require('../middleware/validationMiddleware');

// POST /api/applications (Public - Borrowers submit applications)
router.post('/', validateApplicationSubmit, applicationController.createApplication);

// GET /api/applications (Agent Only - View all applications)
router.get('/', authenticateAgent, applicationController.getApplications);

// PATCH /api/applications/:id/status (Agent Only - Approve/Reject applications)
router.patch('/:id/status', authenticateAgent, validateStatusUpdate, applicationController.updateApplicationStatus);

module.exports = router;
