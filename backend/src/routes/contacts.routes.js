const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts.controller');

router.get('/search', contactsController.searchContacts);
router.get('/stats', contactsController.getContactStats);
router.post('/bulk-delete', contactsController.bulkDelete);
router.post('/bulk-update', contactsController.bulkUpdate);
router.get('/', contactsController.getAllContacts);
router.post('/', contactsController.createContact);
router.get('/:id', contactsController.getContactById);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.deleteContact);
router.post('/:id/tags', contactsController.addTags);
router.delete('/:id/tags', contactsController.removeTags);

module.exports = router;
