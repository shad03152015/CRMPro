const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

class ConversationsService {
  async getConversations(filters = {}) {
    const query = {};

    // Apply filters
    if (filters.contactId) query.contactId = filters.contactId;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.status) query.status = filters.status;
    if (filters.channel) query.channel = filters.channel;
    if (filters.isStarred !== undefined) query.isStarred = filters.isStarred === 'true';
    if (filters.unread) query.unreadCount = { $gt: 0 };

    // Search functionality
    if (filters.search) {
      query.$or = [
        { subject: { $regex: filters.search, $options: 'i' } },
        { lastMessagePreview: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const limit = parseInt(filters.limit) || 50;
    const skip = parseInt(filters.skip) || 0;
    const sortBy = filters.sortBy || 'lastMessageAt';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    const [conversations, total] = await Promise.all([
      Conversation.find(query)
        .populate('contactId', 'firstName lastName email phone company')
        .populate('assignedTo', 'name email')
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .skip(skip)
        .lean(),
      Conversation.countDocuments(query)
    ]);

    return {
      conversations,
      pagination: {
        total,
        limit,
        skip,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getConversationById(conversationId) {
    return await Conversation.findById(conversationId)
      .populate('contactId', 'firstName lastName email phone company jobTitle')
      .populate('assignedTo', 'name email');
  }

  async createConversation(conversationData) {
    const conversation = new Conversation(conversationData);
    return await conversation.save();
  }

  async updateConversation(conversationId, updateData) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('contactId', 'firstName lastName email phone company')
      .populate('assignedTo', 'name email');
  }

  async deleteConversation(conversationId) {
    // Also delete all messages in the conversation
    await Message.deleteMany({ conversationId });
    return await Conversation.findByIdAndDelete(conversationId);
  }

  async toggleStar(conversationId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    conversation.isStarred = !conversation.isStarred;
    return await conversation.save();
  }

  async markAsRead(conversationId) {
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $set: { unreadCount: 0 } },
      { new: true }
    );

    // Mark all messages in conversation as read
    await Message.updateMany(
      { conversationId, readAt: null },
      { $set: { readAt: new Date(), status: 'read' } }
    );

    return conversation;
  }

  async markAsUnread(conversationId) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { $inc: { unreadCount: 1 } },
      { new: true }
    );
  }

  async getMessages(conversationId, filters = {}) {
    const limit = parseInt(filters.limit) || 100;
    const skip = parseInt(filters.skip) || 0;

    const [messages, total] = await Promise.all([
      Message.find({ conversationId })
        .sort({ createdAt: 1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      Message.countDocuments({ conversationId })
    ]);

    return {
      messages,
      pagination: {
        total,
        limit,
        skip,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async createMessage(conversationId, messageData) {
    const message = new Message({
      ...messageData,
      conversationId
    });

    await message.save();

    // Update conversation with last message info
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        lastMessageAt: message.sentAt,
        lastMessagePreview: messageData.content.substring(0, 200)
      },
      $inc: { unreadCount: messageData.direction === 'inbound' ? 1 : 0 }
    });

    return message;
  }

  async getConversationStats() {
    const [total, open, unread, starred] = await Promise.all([
      Conversation.countDocuments({}),
      Conversation.countDocuments({ status: 'open' }),
      Conversation.countDocuments({ unreadCount: { $gt: 0 } }),
      Conversation.countDocuments({ isStarred: true })
    ]);

    const channelBreakdown = await Conversation.aggregate([
      { $group: { _id: '$channel', count: { $sum: 1 } } }
    ]);

    return {
      total,
      open,
      unread,
      starred,
      channelBreakdown
    };
  }
}

module.exports = new ConversationsService();
