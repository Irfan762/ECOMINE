const express = require('express');
const { body } = require('express-validator');
const {
  createAssessment,
  getAssessments,
  getAssessment,
  deleteAssessment
} = require('../controllers/assessmentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkSubscription } = require('../middleware/subscriptionMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(checkSubscription);

// Create Assessment
router.post('/', [
  body('metalType', 'Valid metal type required').isIn(['aluminum', 'copper', 'steel']),
  body('oreGrade', 'Ore grade required').isFloat({ min: 0.1, max: 10 }),
  body('location', 'Valid location required').isIn(['china', 'india', 'europe', 'nordics', 'gcc']),
  body('energyMix', 'Valid energy mix required').isIn(['coal_heavy', 'mixed_grid', 'renewable_heavy']),
  body('processingRoute', 'Valid processing route required').isIn(['pyrometallurgy', 'hydrometallurgy', 'hybrid'])
], createAssessment);

// Get Assessments
router.get('/', getAssessments);

// Get Single Assessment
router.get('/:id', getAssessment);

// Delete Assessment
router.delete('/:id', deleteAssessment);

module.exports = router;
