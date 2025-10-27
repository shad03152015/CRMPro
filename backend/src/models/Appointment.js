const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'tentative'],
    default: 'pending'
  }
}, { _id: false });

const reminderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'sms', 'notification'],
    default: 'email'
  },
  minutesBefore: {
    type: Number,
    default: 15
  }
}, { _id: false });

const recurrenceSchema = new mongoose.Schema({
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'weekly'
  },
  interval: { type: Number, default: 1 },
  endDate: Date,
  count: Number
}, { _id: false });

const appointmentSchema = new mongoose.Schema({
  calendarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Calendar',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  locationType: {
    type: String,
    enum: ['physical', 'phone', 'video', 'other'],
    default: 'physical'
  },
  meetingLink: {
    type: String,
    trim: true
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  attendees: [attendeeSchema],
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'scheduled'
  },
  reminders: [reminderSchema],
  recurring: recurrenceSchema,
  notes: {
    type: String,
    trim: true
  },
  color: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
appointmentSchema.index({ calendarId: 1, startTime: 1 });
appointmentSchema.index({ contactId: 1 });
appointmentSchema.index({ opportunityId: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
