const asyncHandler = require('../middleware/asyncHandler');
const dashboardService = require('../services/dashboard.service');

/**
 * @desc    Get dashboard metrics
 * @route   GET /api/dashboard/metrics
 * @access  Public (will be Private later with auth)
 */
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const { pipelineId, startDate, endDate } = req.query;

  const filters = {
    pipelineId: pipelineId || null,
    startDate: startDate || null,
    endDate: endDate || null
  };

  const metrics = await dashboardService.calculateDashboardMetrics(filters);

  res.status(200).json({
    success: true,
    data: metrics
  });
});

module.exports = {
  getDashboardMetrics
};
