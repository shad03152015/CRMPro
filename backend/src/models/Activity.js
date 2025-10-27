const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: [true, 'Opportunity ID is required']
  },
  type: {
    type: String,
    enum: ['note', 'email', 'call', 'meeting', 'task', 'stage_change'],
    required: [true, 'Activity type is required']
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fromStageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage'
  },
  toStageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stage'
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
activitySchema.index({ opportunityId: 1, createdAt: -1 });
activitySchema.index({ type: 1 });

module.exports = mongoose.model('Activity', activitySchema);
