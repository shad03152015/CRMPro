const Opportunity = require('../models/Opportunity');
const Activity = require('../models/Activity');

class OpportunitiesService {
  /**
   * Get all opportunities with filters and pagination
   */
  async getAllOpportunities(filters = {}, pagination = {}) {
    const { pipelineId, stageId, status } = filters;
    const { limit = 50, skip = 0 } = pagination;

    const query = {};
    if (pipelineId) query.pipelineId = pipelineId;
    if (stageId) query.stageId = stageId;
    if (status) query.status = status;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(query)
        .populate('pipelineId', 'name')
        .populate('stageId', 'name')
        .populate('contactId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Opportunity.countDocuments(query)
    ]);

    return {
      opportunities,
      pagination: {
        total,
        limit,
        skip
      }
    };
  }

  /**
   * Get opportunity by ID
   */
  async getOpportunityById(id) {
    const opportunity = await Opportunity.findById(id)
      .populate('pipelineId')
      .populate('stageId')
      .populate('contactId');

    if (!opportunity) {
      const error = new Error('Opportunity not found');
      error.statusCode = 404;
      throw error;
    }

    return opportunity;
  }

  /**
   * Create new opportunity
   */
  async createOpportunity(data) {
    const opportunity = await Opportunity.create(data);

    // Create activity log for creation
    await Activity.create({
      opportunityId: opportunity._id,
      type: 'note',
      title: 'Opportunity created',
      description: `Opportunity "${opportunity.title}" was created`
    });

    return opportunity;
  }

  /**
   * Update opportunity
   */
  async updateOpportunity(id, data) {
    const opportunity = await Opportunity.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!opportunity) {
      const error = new Error('Opportunity not found');
      error.statusCode = 404;
      throw error;
    }

    return opportunity;
  }

  /**
   * Delete opportunity
   */
  async deleteOpportunity(id) {
    const opportunity = await Opportunity.findByIdAndDelete(id);

    if (!opportunity) {
      const error = new Error('Opportunity not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete associated activities
    await Activity.deleteMany({ opportunityId: id });

    return opportunity;
  }

  /**
   * Move opportunity to different stage
   */
  async moveOpportunityToStage(id, newStageId) {
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      const error = new Error('Opportunity not found');
      error.statusCode = 404;
      throw error;
    }

    const oldStageId = opportunity.stageId;
    opportunity.stageId = newStageId;
    await opportunity.save();

    // Log stage change activity
    await Activity.create({
      opportunityId: id,
      type: 'stage_change',
      title: 'Stage changed',
      fromStageId: oldStageId,
      toStageId: newStageId
    });

    return opportunity;
  }
}

module.exports = new OpportunitiesService();
