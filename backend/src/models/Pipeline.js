const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pipeline name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
pipelineSchema.index({ isActive: 1 });
pipelineSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Pipeline', pipelineSchema);
