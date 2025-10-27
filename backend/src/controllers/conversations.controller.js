const conversationsService = require('../services/conversations.service');

exports.getConversations = async (req, res, next) => {
  try {
    const result = await conversationsService.getConversations(req.query);
    res.json({
      success: true,
      data: result.conversations,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.getConversationById = async (req, res, next) => {
  try {
    const conversation = await conversationsService.getConversationById(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { message: 'Conversation not found' }
      });
    }
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

exports.createConversation = async (req, res, next) => {
  try {
    const conversation = await conversationsService.createConversation(req.body);
    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

exports.updateConversation = async (req, res, next) => {
  try {
    const conversation = await conversationsService.updateConversation(req.params.id, req.body);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { message: 'Conversation not found' }
      });
    }
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteConversation = async (req, res, next) => {
  try {
    const conversation = await conversationsService.deleteConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { message: 'Conversation not found' }
      });
    }
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleStar = async (req, res, next) => {
  try {
    const conversation = await conversationsService.toggleStar(req.params.id);
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    if (error.message === 'Conversation not found') {
      return res.status(404).json({
        success: false,
        error: { message: 'Conversation not found' }
      });
    }
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const conversation = await conversationsService.markAsRead(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { message: 'Conversation not found' }
      });
    }
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsUnread = async (req, res, next) => {
  try {
    const conversation = await conversationsService.markAsUnread(req.params.id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { message: 'Conversation not found' }
      });
    }
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const result = await conversationsService.getMessages(req.params.id, req.query);
    res.json({
      success: true,
      data: result.messages,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.createMessage = async (req, res, next) => {
  try {
    const message = await conversationsService.createMessage(req.params.id, req.body);
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

exports.getConversationStats = async (req, res, next) => {
  try {
    const stats = await conversationsService.getConversationStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
