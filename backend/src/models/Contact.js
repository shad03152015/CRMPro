const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  jobTitle: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  website: {
    type: String,
    trim: true
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  leadSource: {
    type: String,
    enum: ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call', 'Event', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Lead', 'Customer', 'Partner'],
    default: 'Lead'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  },
  lastContactedDate: {
    type: Date
  },
  customFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
contactSchema.index({ email: 1 });
contactSchema.index({ company: 1 });
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
