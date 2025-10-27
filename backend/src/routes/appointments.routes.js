const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointments.controller');

router.get('/available-slots', appointmentsController.getAvailableSlots);
router.get('/', appointmentsController.getAppointments);
router.post('/', appointmentsController.createAppointment);
router.get('/:id', appointmentsController.getAppointmentById);
router.put('/:id', appointmentsController.updateAppointment);
router.delete('/:id', appointmentsController.deleteAppointment);
router.patch('/:id/status', appointmentsController.updateAppointmentStatus);

module.exports = router;
