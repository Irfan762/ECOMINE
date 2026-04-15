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

const router = express.Router();

// Create Scenario
router.post('/', verifyToken, createScenario);

// Get Scenarios
router.get('/', verifyToken, getScenarios);

// Get Single Scenario
router.get('/:id', verifyToken, getScenario);

// Update Scenario
router.put('/:id', verifyToken, updateScenario);

// Delete Scenario
router.delete('/:id', verifyToken, deleteScenario);

// Compare Scenarios
router.post('/compare', verifyToken, compareScenarios);

module.exports = router;
