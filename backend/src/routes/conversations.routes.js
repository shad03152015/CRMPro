const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversations.controller');

// Conversation stats
router.get('/stats', conversationsController.getConversationStats);

// Get all conversations with filters
router.get('/', conversationsController.getConversations);

// Get conversation by ID
router.get('/:id', conversationsController.getConversationById);

// Create new conversation
router.post('/', conversationsController.createConversation);

// Update conversation
router.put('/:id', conversationsController.updateConversation);

// Delete conversation
router.delete('/:id', conversationsController.deleteConversation);

// Toggle star/favorite
router.patch('/:id/star', conversationsController.toggleStar);

// Mark as read
router.patch('/:id/read', conversationsController.markAsRead);

// Mark as unread
router.patch('/:id/unread', conversationsController.markAsUnread);

// Get messages for a conversation
router.get('/:id/messages', conversationsController.getMessages);

// Create message in a conversation
router.post('/:id/messages', conversationsController.createMessage);

module.exports = router;
