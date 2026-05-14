const express = require('express');
const { body } = require('express-validator');
const {
  generateReport,
  getReports,
  getReport,
  deleteReport,
  downloadReport
} = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkSubscription } = require('../middleware/subscriptionMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(checkSubscription);

// Generate Report
router.post('/', [
  body('assessmentId', 'Assessment ID required').notEmpty(),
  body('reportType', 'Valid report type required').isIn(['iso', 'cbam', 'brsr', 'circularity'])
], generateReport);

// Get Reports
router.get('/', getReports);

// Get Single Report
router.get('/:id', getReport);

// Download Report
router.get('/:id/download', downloadReport);

// Delete Report
router.delete('/:id', deleteReport);

module.exports = router;
