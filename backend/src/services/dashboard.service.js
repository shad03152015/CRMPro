const Opportunity = require('../models/Opportunity');
const Stage = require('../models/Stage');
const Pipeline = require('../models/Pipeline');
const mongoose = require('mongoose');

class DashboardService {
  /**
   * Calculate all dashboard metrics
   * @param {Object} filters - { pipelineId, startDate, endDate }
   * @returns {Object} - All dashboard widget data
   */
  async calculateDashboardMetrics(filters = {}) {
    const { pipelineId, startDate, endDate } = filters;

    // Build query filter
    const query = {};
    if (pipelineId) {
      query.pipelineId = mongoose.Types.ObjectId(pipelineId);
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Calculate all metrics in parallel
    const [
      opportunityStatus,
      opportunityValue,
      conversionRate,
      funnel,
      stageDistribution
    ] = await Promise.all([
      this.calculateOpportunityStatus(query),
      this.calculateOpportunityValue(query),
      this.calculateConversionRate(query, startDate, endDate),
      this.calculateFunnel(query),
      this.calculateStageDistribution(query)
    ]);

    return {
      opportunityStatus,
      opportunityValue,
      conversionRate,
      funnel,
      stageDistribution
    };
  }

  /**
   * Calculate opportunity status distribution
   */
  async calculateOpportunityStatus(query) {
    const results = await Opportunity.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusMap = {
      open: 0,
      won: 0,
      lost: 0
    };

    results.forEach(item => {
      statusMap[item._id] = item.count;
    });

    return {
      labels: ['Open', 'Won', 'Lost'],
      values: [statusMap.open, statusMap.won, statusMap.lost]
    };
  }

  /**
   * Calculate opportunity value by stage
   */
  async calculateOpportunityValue(query) {
    const results = await Opportunity.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$stageId',
          totalValue: { $sum: '$value' }
        }
      },
      {
        $lookup: {
          from: 'stages',
          localField: '_id',
          foreignField: '_id',
          as: 'stage'
        }
      },
      { $unwind: { path: '$stage', preserveNullAndEmptyArrays: true } },
      { $sort: { 'stage.order': 1 } }
    ]);

    const labels = results.map(r => r.stage?.name || 'Unknown');
    const values = results.map(r => r.totalValue);

    return {
      labels,
      values
    };
  }

  /**
   * Calculate conversion rate and won revenue
   */
  async calculateConversionRate(query, startDate, endDate) {
    // Current period metrics
    const currentPeriod = await Opportunity.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          wonCount: {
            $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] }
          },
          wonRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'won'] }, '$value', 0] }
          }
        }
      }
    ]);

    const current = currentPeriod[0] || { total: 0, wonCount: 0, wonRevenue: 0 };
    const percentage = current.total > 0 ? (current.wonCount / current.total) * 100 : 0;

    // Previous period for comparison (if dates provided)
    let previousPercentage = 0;
    if (startDate && endDate) {
      const periodLength = new Date(endDate) - new Date(startDate);
      const prevStartDate = new Date(new Date(startDate) - periodLength);
      const prevEndDate = new Date(startDate);

      const prevQuery = {
        ...query,
        createdAt: {
          $gte: prevStartDate,
          $lte: prevEndDate
        }
      };

      const previousPeriod = await Opportunity.aggregate([
        { $match: prevQuery },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            wonCount: {
              $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] }
            }
          }
        }
      ]);

      const previous = previousPeriod[0] || { total: 0, wonCount: 0 };
      previousPercentage = previous.total > 0 ? (previous.wonCount / previous.total) * 100 : 0;
    }

    const change = percentage - previousPercentage;

    return {
      percentage: Math.round(percentage * 10) / 10,
      wonRevenue: current.wonRevenue,
      previousPeriodPercentage: Math.round(previousPercentage * 10) / 10,
      change: Math.round(change * 10) / 10
    };
  }

  /**
   * Calculate funnel metrics
   */
  async calculateFunnel(query) {
    const results = await Opportunity.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$stageId',
          totalValue: { $sum: '$value' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'stages',
          localField: '_id',
          foreignField: '_id',
          as: 'stage'
        }
      },
      { $unwind: { path: '$stage', preserveNullAndEmptyArrays: true } },
      { $sort: { 'stage.order': 1 } }
    ]);

    const totalValue = results.reduce((sum, r) => sum + r.totalValue, 0);
    const totalCount = results.reduce((sum, r) => sum + r.count, 0);

    // Calculate conversion from first to last stage
    const firstStageCount = results[0]?.count || 0;
    const lastStageCount = results[results.length - 1]?.count || 0;
    const conversionPercentage = firstStageCount > 0
      ? (lastStageCount / firstStageCount) * 100
      : 0;

    const stages = results.map(r => ({
      name: r.stage?.name || 'Unknown',
      value: r.totalValue,
      count: r.count
    }));

    return {
      totalValue,
      conversionPercentage: Math.round(conversionPercentage * 10) / 10,
      stages
    };
  }

  /**
   * Calculate stage distribution
   */
  async calculateStageDistribution(query) {
    const results = await Opportunity.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$stageId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'stages',
          localField: '_id',
          foreignField: '_id',
          as: 'stage'
        }
      },
      { $unwind: { path: '$stage', preserveNullAndEmptyArrays: true } },
      { $sort: { 'stage.order': 1 } }
    ]);

    const labels = results.map(r => r.stage?.name || 'Unknown');
    const values = results.map(r => r.count);

    return {
      labels,
      values
    };
  }
}

module.exports = new DashboardService();
