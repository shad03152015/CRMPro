const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema({
  pipelineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pipeline',
    required: [true, 'Pipeline ID is required']
  },
  name: {
    type: String,
    required: [true, 'Stage name is required'],
    trim: true
  },
  order: {
    type: Number,
    required: [true, 'Stage order is required'],
    default: 0
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isClosedWon: {
    type: Boolean,
    default: false
  },
  isClosedLost: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
stageSchema.index({ pipelineId: 1, order: 1 });
stageSchema.index({ pipelineId: 1 });

module.exports = mongoose.model('Stage', stageSchema);
