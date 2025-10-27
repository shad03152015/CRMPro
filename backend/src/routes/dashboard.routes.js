const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/dashboard.controller');

// @route   GET /api/dashboard/metrics
router.get('/metrics', getDashboardMetrics);

module.exports = router;
