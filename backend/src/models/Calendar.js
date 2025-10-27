const mongoose = require('mongoose');

const workingHoursSchema = new mongoose.Schema({
  start: { type: String, default: '09:00' },
  end: { type: String, default: '17:00' },
  isWorkingDay: { type: Boolean, default: true }
}, { _id: false });

const calendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#2196f3'
  },
  timezone: {
    type: String,
    default: 'America/New_York'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  defaultDuration: {
    type: Number,
    default: 30
  },
  workingHours: {
    monday: { type: workingHoursSchema, default: () => ({}) },
    tuesday: { type: workingHoursSchema, default: () => ({}) },
    wednesday: { type: workingHoursSchema, default: () => ({}) },
    thursday: { type: workingHoursSchema, default: () => ({}) },
    friday: { type: workingHoursSchema, default: () => ({}) },
    saturday: { type: workingHoursSchema, default: () => ({ isWorkingDay: false }) },
    sunday: { type: workingHoursSchema, default: () => ({ isWorkingDay: false }) }
  },
  settings: {
    allowBooking: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    bufferTime: { type: Number, default: 0 },
    maxAdvanceBooking: { type: Number, default: 30 },
    minAdvanceBooking: { type: Number, default: 1 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Calendar', calendarSchema);
