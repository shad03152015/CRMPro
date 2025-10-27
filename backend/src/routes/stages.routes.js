const express = require('express');
const router = express.Router();
const {
  getStages,
  createStage,
  updateStage,
  deleteStage
} = require('../controllers/stages.controller');

// @route   GET/POST /api/stages
router.route('/')
  .post(createStage);

// @route   GET /api/stages/:pipelineId
router.get('/:pipelineId', getStages);

// @route   PUT/DELETE /api/stages/:id
router.route('/:id')
  .put(updateStage)
  .delete(deleteStage);

module.exports = router;
