const express = require('express');
const router = express.Router();
const calendarsController = require('../controllers/calendars.controller');

router.get('/', calendarsController.getAllCalendars);
router.post('/', calendarsController.createCalendar);
router.get('/:id', calendarsController.getCalendarById);
router.put('/:id', calendarsController.updateCalendar);
router.delete('/:id', calendarsController.deleteCalendar);
router.post('/:id/assign', calendarsController.assignUser);
router.post('/:id/unassign', calendarsController.unassignUser);
router.get('/:id/stats', calendarsController.getCalendarStats);

module.exports = router;
