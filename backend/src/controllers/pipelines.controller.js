const asyncHandler = require('../middleware/asyncHandler');
const pipelinesService = require('../services/pipelines.service');

/**
 * @desc    Get all pipelines
 * @route   GET /api/pipelines
 * @access  Public
 */
const getPipelines = asyncHandler(async (req, res) => {
  const pipelines = await pipelinesService.getAllPipelines();

  res.status(200).json({
    success: true,
    data: pipelines
  });
});

/**
 * @desc    Get single pipeline
 * @route   GET /api/pipelines/:id
 * @access  Public
 */
const getPipeline = asyncHandler(async (req, res) => {
  const pipeline = await pipelinesService.getPipelineById(req.params.id);

  res.status(200).json({
    success: true,
    data: pipeline
  });
});

/**
 * @desc    Create new pipeline
 * @route   POST /api/pipelines
 * @access  Public
 */
const createPipeline = asyncHandler(async (req, res) => {
  const pipeline = await pipelinesService.createPipeline(req.body);

  res.status(201).json({
    success: true,
    data: pipeline
  });
});

/**
 * @desc    Update pipeline
 * @route   PUT /api/pipelines/:id
 * @access  Public
 */
const updatePipeline = asyncHandler(async (req, res) => {
  const pipeline = await pipelinesService.updatePipeline(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: pipeline
  });
});

/**
 * @desc    Delete pipeline
 * @route   DELETE /api/pipelines/:id
 * @access  Public
 */
const deletePipeline = asyncHandler(async (req, res) => {
  await pipelinesService.deletePipeline(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getPipelines,
  getPipeline,
  createPipeline,
  updatePipeline,
  deletePipeline
};
