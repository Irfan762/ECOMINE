const express = require('express');
const {
  createScenario,
  getScenarios,
  getScenario,
  updateScenario,
  deleteScenario,
  compareScenarios
} = require('../controllers/scenarioController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkSubscription } = require('../middleware/subscriptionMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(checkSubscription);

// Create Scenario
router.post('/', createScenario);

// Get Scenarios
router.get('/', getScenarios);

// Get Single Scenario
router.get('/:id', getScenario);

// Update Scenario
router.put('/:id', updateScenario);

// Delete Scenario
router.delete('/:id', deleteScenario);

// Compare Scenarios
router.post('/compare', compareScenarios);

module.exports = router;
