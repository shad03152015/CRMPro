const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunities.controller');

// @route   GET/POST /api/opportunities
router.route('/')
  .get(getOpportunities)
  .post(createOpportunity);

// @route   GET/PUT/DELETE /api/opportunities/:id
router.route('/:id')
  .get(getOpportunity)
  .put(updateOpportunity)
  .delete(deleteOpportunity);

module.exports = router;
