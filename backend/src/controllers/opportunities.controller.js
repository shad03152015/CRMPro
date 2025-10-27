const asyncHandler = require('../middleware/asyncHandler');
const opportunitiesService = require('../services/opportunities.service');

/**
 * @desc    Get all opportunities
 * @route   GET /api/opportunities
 * @access  Public
 */
const getOpportunities = asyncHandler(async (req, res) => {
  const { pipelineId, stageId, status, limit, skip } = req.query;

  const filters = { pipelineId, stageId, status };
  const pagination = {
    limit: parseInt(limit) || 50,
    skip: parseInt(skip) || 0
  };

  const result = await opportunitiesService.getAllOpportunities(filters, pagination);

  res.status(200).json({
    success: true,
    data: result.opportunities,
    pagination: result.pagination
  });
});

/**
 * @desc    Get single opportunity
 * @route   GET /api/opportunities/:id
 * @access  Public
 */
const getOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await opportunitiesService.getOpportunityById(req.params.id);

  res.status(200).json({
    success: true,
    data: opportunity
  });
});

/**
 * @desc    Create new opportunity
 * @route   POST /api/opportunities
 * @access  Public
 */
const createOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await opportunitiesService.createOpportunity(req.body);

  res.status(201).json({
    success: true,
    data: opportunity
  });
});

/**
 * @desc    Update opportunity
 * @route   PUT /api/opportunities/:id
 * @access  Public
 */
const updateOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await opportunitiesService.updateOpportunity(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    data: opportunity
  });
});

/**
 * @desc    Delete opportunity
 * @route   DELETE /api/opportunities/:id
 * @access  Public
 */
const deleteOpportunity = asyncHandler(async (req, res) => {
  await opportunitiesService.deleteOpportunity(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
};
