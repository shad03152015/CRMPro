const Appointment = require('../models/Appointment');
const Calendar = require('../models/Calendar');

class AppointmentsService {
  async getAppointments(filters = {}) {
    const query = {};

    if (filters.calendarId) query.calendarId = filters.calendarId;
    if (filters.status) query.status = filters.status;
    if (filters.contactId) query.contactId = filters.contactId;
    if (filters.opportunityId) query.opportunityId = filters.opportunityId;

    if (filters.startDate || filters.endDate) {
      query.startTime = {};
      if (filters.startDate) query.startTime.$gte = new Date(filters.startDate);
      if (filters.endDate) query.startTime.$lte = new Date(filters.endDate);
    }

    const limit = parseInt(filters.limit) || 100;
    const skip = parseInt(filters.skip) || 0;

    return await Appointment.find(query)
      .populate('calendarId', 'name color')
      .populate('contactId', 'firstName lastName email')
      .populate('opportunityId', 'name value')
      .sort({ startTime: 1 })
      .limit(limit)
      .skip(skip);
  }

  async getAppointmentById(appointmentId) {
    return await Appointment.findById(appointmentId)
      .populate('calendarId', 'name color timezone')
      .populate('contactId', 'firstName lastName email phone')
      .populate('opportunityId', 'name value stage');
  }

  async createAppointment(appointmentData) {
    // Check for scheduling conflicts
    const conflict = await this.checkSchedulingConflict(
      appointmentData.calendarId,
      appointmentData.startTime,
      appointmentData.endTime
    );

    if (conflict) {
      throw new Error('This time slot is already booked');
    }

    const appointment = new Appointment(appointmentData);
    return await appointment.save();
  }

  async updateAppointment(appointmentId, updateData) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // If time is being updated, check for conflicts
    if (updateData.startTime || updateData.endTime) {
      const startTime = updateData.startTime || appointment.startTime;
      const endTime = updateData.endTime || appointment.endTime;

      const conflict = await this.checkSchedulingConflict(
        appointment.calendarId,
        startTime,
        endTime,
        appointmentId
      );

      if (conflict) {
        throw new Error('This time slot is already booked');
      }
    }

    return await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async deleteAppointment(appointmentId) {
    return await Appointment.findByIdAndDelete(appointmentId);
  }

  async updateAppointmentStatus(appointmentId, status) {
    return await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: { status } },
      { new: true }
    );
  }

  async checkSchedulingConflict(calendarId, startTime, endTime, excludeAppointmentId = null) {
    const query = {
      calendarId,
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) }
        }
      ]
    };

    if (excludeAppointmentId) {
      query._id = { $ne: excludeAppointmentId };
    }

    const conflicts = await Appointment.find(query);
    return conflicts.length > 0;
  }

  async getAvailableSlots(calendarId, date, duration = 30) {
    const calendar = await Calendar.findById(calendarId);
    if (!calendar) {
      throw new Error('Calendar not found');
    }

    const targetDate = new Date(date);
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][targetDate.getDay()];
    const workingHours = calendar.workingHours[dayOfWeek];

    if (!workingHours.isWorkingDay) {
      return [];
    }

    // Get all appointments for the day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      calendarId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled'] }
    }).sort({ startTime: 1 });

    // Generate available slots
    const slots = [];
    const [startHour, startMinute] = workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end.split(':').map(Number);

    const workStart = new Date(targetDate);
    workStart.setHours(startHour, startMinute, 0, 0);
    const workEnd = new Date(targetDate);
    workEnd.setHours(endHour, endMinute, 0, 0);

    let currentTime = new Date(workStart);

    while (currentTime < workEnd) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);

      if (slotEnd > workEnd) break;

      // Check if this slot conflicts with any appointment
      const hasConflict = appointments.some(apt => {
        const aptStart = new Date(apt.startTime);
        const aptEnd = new Date(apt.endTime);
        return currentTime < aptEnd && slotEnd > aptStart;
      });

      if (!hasConflict) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEnd)
        });
      }

      currentTime = new Date(currentTime.getTime() + duration * 60000);
    }

    return slots;
  }
}

module.exports = new AppointmentsService();
