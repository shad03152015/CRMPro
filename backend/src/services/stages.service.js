const Stage = require('../models/Stage');
const Opportunity = require('../models/Opportunity');

class StagesService {
  /**
   * Get stages by pipeline
   */
  async getStagesByPipeline(pipelineId) {
    const stages = await Stage.find({ pipelineId }).sort({ order: 1 });
    return stages;
  }

  /**
   * Create new stage
   */
  async createStage(data) {
    const stage = await Stage.create(data);
    return stage;
  }

  /**
   * Update stage
   */
  async updateStage(id, data) {
    const stage = await Stage.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!stage) {
      const error = new Error('Stage not found');
      error.statusCode = 404;
      throw error;
    }

    return stage;
  }

  /**
   * Delete stage
   */
  async deleteStage(id) {
    // Check if stage has opportunities
    const opportunityCount = await Opportunity.countDocuments({ stageId: id });

    if (opportunityCount > 0) {
      const error = new Error('Cannot delete stage with existing opportunities');
      error.statusCode = 400;
      throw error;
    }

    const stage = await Stage.findByIdAndDelete(id);

    if (!stage) {
      const error = new Error('Stage not found');
      error.statusCode = 404;
      throw error;
    }

    return stage;
  }

  /**
   * Reorder stages
   */
  async reorderStages(pipelineId, stageOrders) {
    // stageOrders is an array of { stageId, order }
    const updatePromises = stageOrders.map(({ stageId, order }) =>
      Stage.findByIdAndUpdate(stageId, { order })
    );

    await Promise.all(updatePromises);

    return this.getStagesByPipeline(pipelineId);
  }
}

module.exports = new StagesService();
