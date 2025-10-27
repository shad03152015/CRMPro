const appointmentsService = require('../services/appointments.service');

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentsService.getAppointments(req.query);
    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentsService.getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Appointment not found' }
      });
    }
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentsService.createAppointment(req.body);
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    if (error.message === 'This time slot is already booked') {
      return res.status(409).json({
        success: false,
        error: { message: error.message }
      });
    }
    next(error);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentsService.updateAppointment(req.params.id, req.body);
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    if (error.message === 'This time slot is already booked') {
      return res.status(409).json({
        success: false,
        error: { message: error.message }
      });
    }
    if (error.message === 'Appointment not found') {
      return res.status(404).json({
        success: false,
        error: { message: error.message }
      });
    }
    next(error);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentsService.deleteAppointment(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Appointment not found' }
      });
    }
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await appointmentsService.updateAppointmentStatus(req.params.id, status);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Appointment not found' }
      });
    }
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { calendarId, date, duration } = req.query;
    const slots = await appointmentsService.getAvailableSlots(
      calendarId,
      date,
      parseInt(duration) || 30
    );
    res.json({
      success: true,
      data: slots
    });
  } catch (error) {
    if (error.message === 'Calendar not found') {
      return res.status(404).json({
        success: false,
        error: { message: error.message }
      });
    }
    next(error);
  }
};
