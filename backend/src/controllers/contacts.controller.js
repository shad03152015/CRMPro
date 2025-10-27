const contactsService = require('../services/contacts.service');

exports.getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.getAllContacts(req.query);
    res.json({
      success: true,
      data: result.contacts,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: { message: 'Contact not found' }
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const contact = await contactsService.createContact(req.body);
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email already exists' }
      });
    }
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    const contact = await contactsService.updateContact(req.params.id, req.body);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: { message: 'Contact not found' }
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await contactsService.deleteContact(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: { message: 'Contact not found' }
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkDelete = async (req, res, next) => {
  try {
    const { contactIds } = req.body;
    const result = await contactsService.bulkDelete(contactIds);
    res.json({
      success: true,
      data: { deletedCount: result.modifiedCount }
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkUpdate = async (req, res, next) => {
  try {
    const { contactIds, updateData } = req.body;
    const result = await contactsService.bulkUpdate(contactIds, updateData);
    res.json({
      success: true,
      data: { updatedCount: result.modifiedCount }
    });
  } catch (error) {
    next(error);
  }
};

exports.getContactStats = async (req, res, next) => {
  try {
    const stats = await contactsService.getContactStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

exports.searchContacts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const contacts = await contactsService.searchContacts(q);
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

exports.addTags = async (req, res, next) => {
  try {
    const { tags } = req.body;
    const contact = await contactsService.addTags(req.params.id, tags);
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

exports.removeTags = async (req, res, next) => {
  try {
    const { tags } = req.body;
    const contact = await contactsService.removeTags(req.params.id, tags);
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};
