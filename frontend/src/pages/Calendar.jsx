import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  List as ListIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { setActiveTab, setSelectedCalendar } from '../store/slices/calendarSlice';
import { useGetCalendarsQuery } from '../store/services/dashboardApi';

const Calendar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeTab, selectedCalendarId } = useSelector((state) => state.calendar);
  const { data: calendarsData, isLoading, error } = useGetCalendarsQuery();
  const calendars = calendarsData?.data || [];

  useEffect(() => {
    if (calendars.length > 0 && !selectedCalendarId) {
      dispatch(setSelectedCalendar(calendars[0]._id));
    }
  }, [calendars, selectedCalendarId, dispatch]);

  const handleTabChange = (event, newValue) => {
    dispatch(setActiveTab(newValue));
  };

  const handleGoToSettings = () => {
    navigate('/calendar-settings');
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isLoading && calendars.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Paper sx={{ p: 8, textAlign: 'center', backgroundColor: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <CalendarIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
            No Calendar Found!
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            Create your first calendar to start scheduling appointments
          </Typography>
          <Button variant="contained" color="primary" startIcon={<SettingsIcon />} onClick={handleGoToSettings}>
            Go to Calendar Settings
          </Button>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load calendars. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
          Calendar
        </Typography>
        <Button variant="outlined" startIcon={<SettingsIcon />} onClick={handleGoToSettings} sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#fff', '&:hover': { borderColor: 'rgba(255, 255, 255, 0.3)' } }}>
          Settings
        </Button>
      </Box>

      <Paper sx={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.7)', textTransform: 'none', fontSize: '1rem', fontWeight: 500 }, '& .Mui-selected': { color: '#2196f3 !important' }, '& .MuiTabs-indicator': { backgroundColor: '#2196f3' } }}>
          <Tab icon={<CalendarIcon />} iconPosition="start" label="Calendar View" value="calendar" />
          <Tab icon={<ListIcon />} iconPosition="start" label="Appointment List View" value="list" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 'calendar' && (
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Calendar view - Showing appointments for {calendars.find(c => c._id === selectedCalendarId)?.name || 'All Calendars'}
            </Typography>
          )}
          {activeTab === 'list' && (
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              List view - Showing appointments for {calendars.find(c => c._id === selectedCalendarId)?.name || 'All Calendars'}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Calendar;
