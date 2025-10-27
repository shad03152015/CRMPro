const Pipeline = require('../models/Pipeline');
const Stage = require('../models/Stage');

class PipelinesService {
  /**
   * Get all active pipelines
   */
  async getAllPipelines() {
    const pipelines = await Pipeline.find({ isActive: true }).sort({ createdAt: -1 });
    return pipelines;
  }

  /**
   * Get pipeline by ID
   */
  async getPipelineById(id) {
    const pipeline = await Pipeline.findById(id);

    if (!pipeline) {
      const error = new Error('Pipeline not found');
      error.statusCode = 404;
      throw error;
    }

    return pipeline;
  }

  /**
   * Create new pipeline
   */
  async createPipeline(data) {
    const pipeline = await Pipeline.create(data);

    // Create default stages for new pipeline
    const defaultStages = [
      { name: 'Lead', order: 0, probability: 10 },
      { name: 'Qualified', order: 1, probability: 25 },
      { name: 'Proposal', order: 2, probability: 50 },
      { name: 'Negotiation', order: 3, probability: 75 },
      { name: 'Closed Won', order: 4, probability: 100, isClosedWon: true },
      { name: 'Closed Lost', order: 5, probability: 0, isClosedLost: true }
    ];

    await Stage.insertMany(
      defaultStages.map(stage => ({
        ...stage,
        pipelineId: pipeline._id
      }))
    );

    return pipeline;
  }

  /**
   * Update pipeline
   */
  async updatePipeline(id, data) {
    const pipeline = await Pipeline.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!pipeline) {
      const error = new Error('Pipeline not found');
      error.statusCode = 404;
      throw error;
    }

    return pipeline;
  }

  /**
   * Delete pipeline (soft delete)
   */
  async deletePipeline(id) {
    const pipeline = await Pipeline.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!pipeline) {
      const error = new Error('Pipeline not found');
      error.statusCode = 404;
      throw error;
    }

    return pipeline;
  }
}

module.exports = new PipelinesService();
