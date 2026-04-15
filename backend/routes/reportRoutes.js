const express = require('express');
const { body } = require('express-validator');
const {
  generateReport,
  getReports,
  getReport,
  deleteReport
} = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate Report
router.post('/', verifyToken, [
  body('assessmentId', 'Assessment ID required').notEmpty(),
  body('reportType', 'Valid report type required').isIn(['iso', 'cbam', 'brsr', 'circularity'])
], generateReport);

// Get Reports
router.get('/', verifyToken, getReports);

// Get Single Report
router.get('/:id', verifyToken, getReport);

// Delete Report
router.delete('/:id', verifyToken, deleteReport);

module.exports = router;
