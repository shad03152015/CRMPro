import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon
} from '@mui/icons-material';
import {
  useGetConversationsQuery,
  useGetConversationQuery,
  useGetMessagesQuery,
  useGetContactQuery,
  useToggleConversationStarMutation,
  useMarkConversationAsReadMutation,
  useCreateMessageMutation
} from '../store/services/dashboardApi';

const Conversations = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [search, setSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // Build filters based on selected tab
  const filters = { search };
  if (selectedTab === 'unread') filters.unread = true;
  if (selectedTab === 'starred') filters.isStarred = true;

  const { data: conversationsData, isLoading: loadingConversations } = useGetConversationsQuery(filters);
  const { data: conversationData } = useGetConversationQuery(selectedConversationId, {
    skip: !selectedConversationId
  });
  const { data: messagesData, isLoading: loadingMessages } = useGetMessagesQuery(
    { conversationId: selectedConversationId },
    { skip: !selectedConversationId }
  );
  const { data: contactData } = useGetContactQuery(
    conversationData?.data?.contactId?._id || conversationData?.data?.contactId,
    { skip: !conversationData?.data?.contactId }
  );

  const [toggleStar] = useToggleConversationStarMutation();
  const [markAsRead] = useMarkConversationAsReadMutation();
  const [createMessage] = useCreateMessageMutation();

  const conversations = conversationsData?.data || [];
  const conversation = conversationData?.data;
  const messages = messagesData?.data || [];
  const contact = contactData?.data;

  const handleSelectConversation = async (conversationId) => {
    setSelectedConversationId(conversationId);
    const conv = conversations.find(c => c._id === conversationId);
    if (conv && conv.unreadCount > 0) {
      await markAsRead(conversationId);
    }
  };

  const handleToggleStar = async (conversationId, e) => {
    e.stopPropagation();
    await toggleStar(conversationId);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId) return;

    await createMessage({
      conversationId: selectedConversationId,
      content: messageText,
      direction: 'outbound',
      sender: {
        type: 'user',
        name: 'Sales Team',
        email: 'sales@crmpro.com'
      }
    });

    setMessageText('');
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return <EmailIcon fontSize="small" />;
      case 'chat': return <ChatIcon fontSize="small" />;
      case 'phone': return <PhoneIcon fontSize="small" />;
      case 'whatsapp': return <WhatsAppIcon fontSize="small" />;
      case 'sms': return <SmsIcon fontSize="small" />;
      default: return <ChatIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'success';
      case 'pending': return 'warning';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', bgcolor: '#0a0e27', p: 2, gap: 2 }}>
      {/* Left Panel - Conversation List */}
      <Paper sx={{ width: 380, display: 'flex', flexDirection: 'column', bgcolor: '#151b35', color: 'white' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Conversations
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              bgcolor: '#1e2642',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: '#2d3548' },
                '&:hover fieldset': { borderColor: '#3d4558' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#8b92b2' }} />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: '#2d3548',
            '& .MuiTab-root': { color: '#8b92b2', minHeight: 48 },
            '& .Mui-selected': { color: '#3b82f6' }
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Unread" value="unread" />
          <Tab label="Starred" value="starred" />
          <Tab label="Recents" value="recents" />
        </Tabs>

        <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {loadingConversations ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={30} />
            </Box>
          ) : conversations.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="#8b92b2">
                {selectedTab === 'unread' ? 'No unread conversations found' : 'No conversations found'}
              </Typography>
            </Box>
          ) : (
            conversations.map((conv) => (
              <React.Fragment key={conv._id}>
                <ListItem
                  button
                  selected={selectedConversationId === conv._id}
                  onClick={() => handleSelectConversation(conv._id)}
                  sx={{
                    py: 2,
                    px: 2,
                    bgcolor: selectedConversationId === conv._id ? '#1e2642' : 'transparent',
                    '&:hover': { bgcolor: '#1a2038' },
                    cursor: 'pointer'
                  }}
                >
                  <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
                    {conv.contactId?.firstName?.[0] || 'U'}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: conv.unreadCount > 0 ? 600 : 400, flex: 1 }}>
                          {conv.contactId?.firstName} {conv.contactId?.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {getChannelIcon(conv.channel)}
                          <Typography variant="caption" color="#8b92b2">
                            {formatTime(conv.lastMessageAt)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: conv.unreadCount > 0 ? 'white' : '#8b92b2',
                            fontWeight: conv.unreadCount > 0 ? 500 : 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mb: 0.5
                          }}
                        >
                          {conv.subject || conv.lastMessagePreview}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          <Chip
                            label={conv.status}
                            size="small"
                            color={getStatusColor(conv.status)}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                          {conv.unreadCount > 0 && (
                            <Chip
                              label={conv.unreadCount}
                              size="small"
                              color="primary"
                              sx={{ height: 20, fontSize: '0.7rem', minWidth: 20 }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => handleToggleStar(conv._id, e)}
                    sx={{ color: conv.isStarred ? '#fbbf24' : '#8b92b2' }}
                  >
                    {conv.isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                  </IconButton>
                </ListItem>
                <Divider sx={{ bgcolor: '#2d3548' }} />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Center Panel - Message Thread */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#151b35', color: 'white' }}>
        {!selectedConversationId ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="#8b92b2">No conversation selected</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: '#2d3548', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {conversation?.subject || 'Conversation'}
                </Typography>
                <Typography variant="caption" color="#8b92b2">
                  {conversation?.contactId?.firstName} {conversation?.contactId?.lastName} • {conversation?.contactId?.email}
                </Typography>
              </Box>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: 'white' }}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { bgcolor: '#1e2642', color: 'white' } }}
              >
                <MenuItem onClick={() => setAnchorEl(null)}>Mark as unread</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>Close conversation</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>Delete</MenuItem>
              </Menu>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {loadingMessages ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : messages.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Typography color="#8b92b2">No messages yet</Typography>
                </Box>
              ) : (
                messages.map((message) => (
                  <Box
                    key={message._id}
                    sx={{
                      mb: 2,
                      display: 'flex',
                      justifyContent: message.direction === 'outbound' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        bgcolor: message.direction === 'outbound' ? '#3b82f6' : '#1e2642',
                        color: 'white',
                        p: 2,
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, opacity: 0.8 }}>
                        {message.sender?.name || 'Unknown'} • {formatTime(message.sentAt)}
                      </Typography>
                      <Typography variant="body2">{message.content}</Typography>
                      {message.attachments && message.attachments.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {message.attachments.map((att, idx) => (
                            <Chip
                              key={idx}
                              icon={<AttachFileIcon fontSize="small" />}
                              label={att.filename}
                              size="small"
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: 1, borderColor: '#2d3548' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  sx={{
                    bgcolor: '#1e2642',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: '#2d3548' },
                      '&:hover fieldset': { borderColor: '#3d4558' }
                    }
                  }}
                />
                <IconButton sx={{ color: '#8b92b2' }}>
                  <AttachFileIcon />
                </IconButton>
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                >
                  <SendIcon />
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>

      {/* Right Panel - Contact Details */}
      <Paper sx={{ width: 320, bgcolor: '#151b35', color: 'white', p: 2, overflow: 'auto' }}>
        {!selectedConversationId || !contact ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="#8b92b2">No contact selected</Typography>
          </Box>
        ) : (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#3b82f6', mx: 'auto', mb: 2, fontSize: '2rem' }}>
                {contact.firstName?.[0]}{contact.lastName?.[0]}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {contact.firstName} {contact.lastName}
              </Typography>
              <Typography variant="body2" color="#8b92b2">
                {contact.jobTitle} {contact.company && `at ${contact.company}`}
              </Typography>
            </Box>

            <Divider sx={{ bgcolor: '#2d3548', my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="#8b92b2" sx={{ display: 'block', mb: 1 }}>
                EMAIL
              </Typography>
              <Typography variant="body2">{contact.email}</Typography>
            </Box>

            {contact.phone && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="#8b92b2" sx={{ display: 'block', mb: 1 }}>
                  PHONE
                </Typography>
                <Typography variant="body2">{contact.phone}</Typography>
              </Box>
            )}

            {contact.company && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="#8b92b2" sx={{ display: 'block', mb: 1 }}>
                  COMPANY
                </Typography>
                <Typography variant="body2">{contact.company}</Typography>
              </Box>
            )}

            {contact.status && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="#8b92b2" sx={{ display: 'block', mb: 1 }}>
                  STATUS
                </Typography>
                <Chip label={contact.status} size="small" color="primary" />
              </Box>
            )}

            {contact.tags && contact.tags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="#8b92b2" sx={{ display: 'block', mb: 1 }}>
                  TAGS
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {contact.tags.map((tag, idx) => (
                    <Chip key={idx} label={tag} size="small" sx={{ bgcolor: '#1e2642' }} />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ bgcolor: '#2d3548', my: 2 }} />

            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: '#2d3548',
                color: 'white',
                '&:hover': { borderColor: '#3d4558', bgcolor: '#1e2642' }
              }}
            >
              View Full Profile
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Conversations;
