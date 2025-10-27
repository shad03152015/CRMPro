import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  CheckCircle as ActiveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  useGetCalendarsQuery,
  useCreateCalendarMutation,
  useUpdateCalendarMutation,
  useDeleteCalendarMutation
} from '../store/services/dashboardApi';

const CalendarSettings = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#2196f3', timezone: 'America/New_York', defaultDuration: 30 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: calendarsData, isLoading } = useGetCalendarsQuery();
  const [createCalendar, { isLoading: isCreating }] = useCreateCalendarMutation();
  const [updateCalendar, { isLoading: isUpdating }] = useUpdateCalendarMutation();
  const [deleteCalendar, { isLoading: isDeleting }] = useDeleteCalendarMutation();

  const calendars = calendarsData?.data || [];

  const handleOpenDialog = (calendar = null) => {
    if (calendar) {
      setEditingCalendar(calendar);
      setFormData({ name: calendar.name, description: calendar.description || '', color: calendar.color || '#2196f3', timezone: calendar.timezone || 'America/New_York', defaultDuration: calendar.defaultDuration || 30 });
    } else {
      setEditingCalendar(null);
      setFormData({ name: '', description: '', color: '#2196f3', timezone: 'America/New_York', defaultDuration: 30 });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCalendar(null);
    setFormData({ name: '', description: '', color: '#2196f3', timezone: 'America/New_York', defaultDuration: 30 });
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingCalendar) {
        await updateCalendar({ id: editingCalendar._id, ...formData }).unwrap();
        setSnackbar({ open: true, message: 'Calendar updated successfully', severity: 'success' });
      } else {
        await createCalendar({ ...formData, isActive: true, settings: { allowBooking: true, requireApproval: false, bufferTime: 5, maxAdvanceBooking: 30, minAdvanceBooking: 1 } }).unwrap();
        setSnackbar({ open: true, message: 'Calendar created successfully', severity: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: error.data?.error?.message || 'Failed to save calendar', severity: 'error' });
    }
  };

  const handleDelete = async (calendarId) => {
    if (!window.confirm('Are you sure you want to delete this calendar?')) return;
    try {
      await deleteCalendar(calendarId).unwrap();
      setSnackbar({ open: true, message: 'Calendar deleted successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.data?.error?.message || 'Failed to delete calendar', severity: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/calendar')} sx={{ color: '#fff' }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
            Calendar Settings
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          New Calendar
        </Button>
      </Box>

      <Paper sx={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3 }}>
          {calendars.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 2 }}>
                No calendars yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.3)', mb: 3 }}>
                Create your first calendar to start scheduling appointments
              </Typography>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                Create Calendar
              </Button>
            </Box>
          ) : (
            <List>
              {calendars.map((calendar) => (
                <ListItem key={calendar._id} sx={{ mb: 2, p: 2, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.1)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                  <Box sx={{ width: 8, height: 60, backgroundColor: calendar.color || '#2196f3', borderRadius: 1, mr: 2 }} />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                          {calendar.name}
                        </Typography>
                        {calendar.isActive && (
                          <Chip icon={<ActiveIcon fontSize="small" />} label="Active" size="small" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', fontWeight: 500 }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        {calendar.description && (
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            {calendar.description}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Timezone: {calendar.timezone}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Default Duration: {calendar.defaultDuration} min
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" sx={{ color: '#fff', mr: 1 }} onClick={() => handleOpenDialog(calendar)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" sx={{ color: '#f44336' }} onClick={() => handleDelete(calendar._id)} disabled={isDeleting}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)' } }}>
        <DialogTitle sx={{ color: '#fff' }}>
          {editingCalendar ? 'Edit Calendar' : 'Create New Calendar'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Calendar Name" name="name" value={formData.name} onChange={handleInputChange} required sx={{ '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&.Mui-focused fieldset': { borderColor: '#2196f3' } } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleInputChange} multiline rows={3} sx={{ '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&.Mui-focused fieldset': { borderColor: '#2196f3' } } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Color" name="color" type="color" value={formData.color} onChange={handleInputChange} sx={{ '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&.Mui-focused fieldset': { borderColor: '#2196f3' } } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Default Duration (minutes)" name="defaultDuration" type="number" value={formData.defaultDuration} onChange={handleInputChange} inputProps={{ min: 15, max: 480, step: 15 }} sx={{ '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&.Mui-focused fieldset': { borderColor: '#2196f3' } } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!formData.name || isCreating || isUpdating}>
            {isCreating || isUpdating ? <CircularProgress size={24} /> : editingCalendar ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CalendarSettings;
