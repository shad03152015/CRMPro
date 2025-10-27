const Contact = require('../models/Contact');

class ContactsService {
  async getAllContacts(filters = {}) {
    const query = { isActive: true };

    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.company) query.company = { $regex: filters.company, $options: 'i' };
    if (filters.leadSource) query.leadSource = filters.leadSource;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags };

    // Search functionality
    if (filters.search) {
      const searchRegex = { $regex: filters.search, $options: 'i' };
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
        { phone: searchRegex }
      ];
    }

    const limit = parseInt(filters.limit) || 50;
    const skip = parseInt(filters.skip) || 0;
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .populate('assignedTo', 'name email')
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .skip(skip)
        .lean(),
      Contact.countDocuments(query)
    ]);

    return {
      contacts,
      pagination: {
        total,
        limit,
        skip,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getContactById(contactId) {
    return await Contact.findById(contactId)
      .populate('assignedTo', 'name email');
  }

  async createContact(contactData) {
    const contact = new Contact(contactData);
    return await contact.save();
  }

  async updateContact(contactId, updateData) {
    return await Contact.findByIdAndUpdate(
      contactId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
  }

  async deleteContact(contactId) {
    return await Contact.findByIdAndUpdate(
      contactId,
      { $set: { isActive: false } },
      { new: true }
    );
  }

  async bulkDelete(contactIds) {
    return await Contact.updateMany(
      { _id: { $in: contactIds } },
      { $set: { isActive: false } }
    );
  }

  async bulkUpdate(contactIds, updateData) {
    return await Contact.updateMany(
      { _id: { $in: contactIds } },
      { $set: updateData }
    );
  }

  async getContactsByCompany(company) {
    return await Contact.find({
      company,
      isActive: true
    })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
  }

  async getContactStats() {
    const [totalContacts, statusBreakdown, leadSourceBreakdown, recentContacts] = await Promise.all([
      Contact.countDocuments({ isActive: true }),
      Contact.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Contact.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$leadSource', count: { $sum: 1 } } }
      ]),
      Contact.countDocuments({
        isActive: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    return {
      totalContacts,
      statusBreakdown,
      leadSourceBreakdown,
      recentContacts
    };
  }

  async searchContacts(searchTerm) {
    const searchRegex = { $regex: searchTerm, $options: 'i' };
    return await Contact.find({
      isActive: true,
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
        { phone: searchRegex }
      ]
    })
      .populate('assignedTo', 'name email')
      .limit(20)
      .lean();
  }

  async addTags(contactId, tags) {
    return await Contact.findByIdAndUpdate(
      contactId,
      { $addToSet: { tags: { $each: tags } } },
      { new: true }
    );
  }

  async removeTags(contactId, tags) {
    return await Contact.findByIdAndUpdate(
      contactId,
      { $pullAll: { tags: tags } },
      { new: true }
    );
  }
}

module.exports = new ContactsService();
