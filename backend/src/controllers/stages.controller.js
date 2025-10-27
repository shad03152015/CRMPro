const asyncHandler = require('../middleware/asyncHandler');
const stagesService = require('../services/stages.service');

/**
 * @desc    Get stages by pipeline
 * @route   GET /api/stages/:pipelineId
 * @access  Public
 */
const getStages = asyncHandler(async (req, res) => {
  const stages = await stagesService.getStagesByPipeline(req.params.pipelineId);

  res.status(200).json({
    success: true,
    data: stages
  });
});

/**
 * @desc    Create new stage
 * @route   POST /api/stages
 * @access  Public
 */
const createStage = asyncHandler(async (req, res) => {
  const stage = await stagesService.createStage(req.body);

  res.status(201).json({
    success: true,
    data: stage
  });
});

/**
 * @desc    Update stage
 * @route   PUT /api/stages/:id
 * @access  Public
 */
const updateStage = asyncHandler(async (req, res) => {
  const stage = await stagesService.updateStage(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: stage
  });
});

/**
 * @desc    Delete stage
 * @route   DELETE /api/stages/:id
 * @access  Public
 */
const deleteStage = asyncHandler(async (req, res) => {
  await stagesService.deleteStage(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getStages,
  createStage,
  updateStage,
  deleteStage
};
