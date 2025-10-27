const Calendar = require('../models/Calendar');
const Appointment = require('../models/Appointment');

class CalendarsService {
  async getAllCalendars() {
    return await Calendar.find({ isActive: true })
      .populate('ownerId', 'name email')
      .populate('assignedUsers', 'name email')
      .sort({ createdAt: -1 });
  }

  async getCalendarById(calendarId) {
    return await Calendar.findById(calendarId)
      .populate('ownerId', 'name email')
      .populate('assignedUsers', 'name email');
  }

  async createCalendar(calendarData) {
    const calendar = new Calendar(calendarData);
    return await calendar.save();
  }

  async updateCalendar(calendarId, updateData) {
    return await Calendar.findByIdAndUpdate(
      calendarId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async deleteCalendar(calendarId) {
    return await Calendar.findByIdAndUpdate(
      calendarId,
      { $set: { isActive: false } },
      { new: true }
    );
  }

  async assignUserToCalendar(calendarId, userId) {
    return await Calendar.findByIdAndUpdate(
      calendarId,
      { $addToSet: { assignedUsers: userId } },
      { new: true }
    );
  }

  async unassignUserFromCalendar(calendarId, userId) {
    return await Calendar.findByIdAndUpdate(
      calendarId,
      { $pull: { assignedUsers: userId } },
      { new: true }
    );
  }

  async getCalendarStatistics(calendarId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [totalAppointments, upcomingAppointments, completedAppointments, cancelledAppointments] = await Promise.all([
      Appointment.countDocuments({ calendarId }),
      Appointment.countDocuments({
        calendarId,
        startTime: { $gte: now },
        status: { $in: ['scheduled', 'confirmed'] }
      }),
      Appointment.countDocuments({
        calendarId,
        status: 'completed',
        startTime: { $gte: startOfMonth, $lte: endOfMonth }
      }),
      Appointment.countDocuments({
        calendarId,
        status: 'cancelled',
        startTime: { $gte: startOfMonth, $lte: endOfMonth }
      })
    ]);

    return {
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      month: {
        start: startOfMonth,
        end: endOfMonth
      }
    };
  }
}

module.exports = new CalendarsService();
