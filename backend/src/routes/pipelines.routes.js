const express = require('express');
const router = express.Router();
const {
  getPipelines,
  getPipeline,
  createPipeline,
  updatePipeline,
  deletePipeline
} = require('../controllers/pipelines.controller');

// @route   GET/POST /api/pipelines
router.route('/')
  .get(getPipelines)
  .post(createPipeline);

// @route   GET/PUT/DELETE /api/pipelines/:id
router.route('/:id')
  .get(getPipeline)
  .put(updatePipeline)
  .delete(deletePipeline);

module.exports = router;
