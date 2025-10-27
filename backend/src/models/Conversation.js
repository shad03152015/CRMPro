const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subject: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'pending'],
    default: 'open'
  },
  channel: {
    type: String,
    enum: ['email', 'sms', 'chat', 'phone', 'whatsapp', 'other'],
    default: 'email'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  lastMessagePreview: {
    type: String,
    maxlength: 200
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for performance
conversationSchema.index({ contactId: 1 });
conversationSchema.index({ assignedTo: 1 });
conversationSchema.index({ status: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ isStarred: 1 });
conversationSchema.index({ unreadCount: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
