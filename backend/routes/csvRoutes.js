const express = require('express');
const router = express.Router();
const csvUploadController = require('../controllers/csvUploadController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Upload CSV file for batch LCA calculation
router.post('/upload', csvUploadController.uploadCSV);

// Download CSV template
router.get('/template', csvUploadController.downloadTemplate);

// Get upload history
router.get('/history', csvUploadController.getUploadHistory);

module.exports = router;
