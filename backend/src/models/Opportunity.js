const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Opportunity title is required'],
    trim: true
  },
  value: {
    type: Number,
    required: [true, 'Opportunity value is required'],
    min: [0, 'Value cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  pipelineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pipeline',
    required: [true, 'Pipeline ID is required']
  },
  stageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage',
    required: [true, 'Stage ID is required']
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  probability: {
    type: Number,
    min: 0,
    max: 100
  },
  expectedCloseDate: {
    type: Date
  },
  actualCloseDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'won', 'lost'],
    default: 'open'
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  customFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for performance
opportunitySchema.index({ pipelineId: 1, status: 1 });
opportunitySchema.index({ stageId: 1 });
opportunitySchema.index({ createdAt: -1 });
opportunitySchema.index({ status: 1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);
