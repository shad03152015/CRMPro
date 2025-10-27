import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import {
  useGetContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useBulkDeleteContactsMutation
} from '../store/services/dashboardApi';

const Contacts = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', leadSource: '' });
  const [selected, setSelected] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    status: 'Lead',
    leadSource: 'Other'
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  const limit = 25;
  const skip = (page - 1) * limit;

  const { data: contactsData, isLoading, error } = useGetContactsQuery({
    search,
    ...filters,
    limit,
    skip
  });

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
  const [deleteContact] = useDeleteContactMutation();
  const [bulkDeleteContacts] = useBulkDeleteContactsMutation();

  const contacts = contactsData?.data || [];
  const pagination = contactsData?.pagination || { total: 0, pages: 1 };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(contacts.map((c) => c._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        jobTitle: contact.jobTitle || '',
        status: contact.status || 'Lead',
        leadSource: contact.leadSource || 'Other'
      });
    } else {
      setEditingContact(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        status: 'Lead',
        leadSource: 'Other'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingContact(null);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingContact) {
        await updateContact({ id: editingContact._id, ...formData }).unwrap();
      } else {
        await createContact(formData).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save contact:', error);
    }
  };

  const handleMenuOpen = (event, contact) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null);
  };

  const handleEdit = () => {
    handleOpenDialog(selectedContact);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedContact && window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(selectedContact._id);
    }
    handleMenuClose();
  };

  const handleBulkDelete = async () => {
    if (selected.length > 0 && window.confirm(`Delete ${selected.length} contacts?`)) {
      await bulkDeleteContacts(selected);
      setSelected([]);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: 'success',
      Lead: 'info',
      Customer: 'primary',
      Partner: 'secondary',
      Inactive: 'default'
    };
    return colors[status] || 'default';
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load contacts. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
          Contacts
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Contact
        </Button>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Quick search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              flex: 1,
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              )
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              displayEmpty
              sx={{
                color: '#fff',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Lead">Lead</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Customer">Customer</MenuItem>
              <MenuItem value="Partner">Partner</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={filters.leadSource}
              onChange={(e) => setFilters((prev) => ({ ...prev, leadSource: e.target.value }))}
              displayEmpty
              sx={{
                color: '#fff',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              <MenuItem value="">All Sources</MenuItem>
              <MenuItem value="Website">Website</MenuItem>
              <MenuItem value="Referral">Referral</MenuItem>
              <MenuItem value="Social Media">Social Media</MenuItem>
              <MenuItem value="Email Campaign">Email Campaign</MenuItem>
              <MenuItem value="Cold Call">Cold Call</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          {selected.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
            >
              Delete ({selected.length})
            </Button>
          )}
        </Box>
      </Paper>

      {/* Contacts Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={contacts.length > 0 && selected.length === contacts.length}
                  indeterminate={selected.length > 0 && selected.length < contacts.length}
                  onChange={handleSelectAll}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                />
              </TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>Phone</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>Company</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>Source</TableCell>
              <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 8, color: 'rgba(255, 255, 255, 0.5)' }}>
                  <PersonIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6">No contacts found</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {search || filters.status || filters.leadSource ? 'Try adjusting your filters' : 'Create your first contact to get started'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow
                  key={contact._id}
                  hover
                  sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(contact._id)}
                      onChange={() => handleSelectOne(contact._id)}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>
                    {contact.firstName} {contact.lastName}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      {contact.email}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {contact.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        {contact.phone}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {contact.company && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BusinessIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        {contact.company}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={contact.status} color={getStatusColor(contact.status)} size="small" />
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                    {contact.leadSource}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, contact)}
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          />
        </Box>
      )}

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)' } }}>
        <DialogTitle sx={{ color: '#fff' }}>
          {editingContact ? 'Edit Contact' : 'Add New Contact'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                  sx={{
                    color: '#fff',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                >
                  <MenuItem value="Lead">Lead</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Partner">Partner</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Lead Source</InputLabel>
                <Select
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleInputChange}
                  label="Lead Source"
                  sx={{
                    color: '#fff',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                >
                  <MenuItem value="Website">Website</MenuItem>
                  <MenuItem value="Referral">Referral</MenuItem>
                  <MenuItem value="Social Media">Social Media</MenuItem>
                  <MenuItem value="Email Campaign">Email Campaign</MenuItem>
                  <MenuItem value="Cold Call">Cold Call</MenuItem>
                  <MenuItem value="Event">Event</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.firstName || !formData.lastName || !formData.email || isCreating || isUpdating}
          >
            {isCreating || isUpdating ? <CircularProgress size={24} /> : editingContact ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Contacts;
