const calendarsService = require('../services/calendars.service');

exports.getAllCalendars = async (req, res, next) => {
  try {
    const calendars = await calendarsService.getAllCalendars();
    res.json({
      success: true,
      data: calendars
    });
  } catch (error) {
    next(error);
  }
};

exports.getCalendarById = async (req, res, next) => {
  try {
    const calendar = await calendarsService.getCalendarById(req.params.id);
    if (!calendar) {
      return res.status(404).json({
        success: false,
        error: { message: 'Calendar not found' }
      });
    }
    res.json({
      success: true,
      data: calendar
    });
  } catch (error) {
    next(error);
  }
};

exports.createCalendar = async (req, res, next) => {
  try {
    const calendar = await calendarsService.createCalendar(req.body);
    res.status(201).json({
      success: true,
      data: calendar
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCalendar = async (req, res, next) => {
  try {
    const calendar = await calendarsService.updateCalendar(req.params.id, req.body);
    if (!calendar) {
      return res.status(404).json({
        success: false,
        error: { message: 'Calendar not found' }
      });
    }
    res.json({
      success: true,
      data: calendar
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCalendar = async (req, res, next) => {
  try {
    const calendar = await calendarsService.deleteCalendar(req.params.id);
    if (!calendar) {
      return res.status(404).json({
        success: false,
        error: { message: 'Calendar not found' }
      });
    }
    res.json({
      success: true,
      data: calendar
    });
  } catch (error) {
    next(error);
  }
};

exports.assignUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const calendar = await calendarsService.assignUserToCalendar(req.params.id, userId);
    res.json({
      success: true,
      data: calendar
    });
  } catch (error) {
    next(error);
  }
};

exports.unassignUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const calendar = await calendarsService.unassignUserFromCalendar(req.params.id, userId);
    res.json({
      success: true,
      data: calendar
    });
  } catch (error) {
    next(error);
  }
};

exports.getCalendarStats = async (req, res, next) => {
  try {
    const stats = await calendarsService.getCalendarStatistics(req.params.id);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
