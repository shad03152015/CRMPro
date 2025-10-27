import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCalendarId: null,
  viewMode: 'month', // 'month', 'week', 'day', 'list'
  selectedDate: new Date().toISOString(),
  showWeekends: true,
  timeFormat: '12h', // '12h' or '24h'
  startOfWeek: 0, // 0 = Sunday, 1 = Monday
  activeTab: 'calendar' // 'calendar', 'list', 'settings'
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedCalendar: (state, action) => {
      state.selectedCalendarId = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setShowWeekends: (state, action) => {
      state.showWeekends = action.payload;
    },
    setTimeFormat: (state, action) => {
      state.timeFormat = action.payload;
    },
    setStartOfWeek: (state, action) => {
      state.startOfWeek = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    navigateToToday: (state) => {
      state.selectedDate = new Date().toISOString();
    },
    navigateNext: (state) => {
      const date = new Date(state.selectedDate);
      switch (state.viewMode) {
        case 'month':
          date.setMonth(date.getMonth() + 1);
          break;
        case 'week':
          date.setDate(date.getDate() + 7);
          break;
        case 'day':
          date.setDate(date.getDate() + 1);
          break;
      }
      state.selectedDate = date.toISOString();
    },
    navigatePrevious: (state) => {
      const date = new Date(state.selectedDate);
      switch (state.viewMode) {
        case 'month':
          date.setMonth(date.getMonth() - 1);
          break;
        case 'week':
          date.setDate(date.getDate() - 7);
          break;
        case 'day':
          date.setDate(date.getDate() - 1);
          break;
      }
      state.selectedDate = date.toISOString();
    },
    resetCalendarState: () => initialState
  }
});

export const {
  setSelectedCalendar,
  setViewMode,
  setSelectedDate,
  setShowWeekends,
  setTimeFormat,
  setStartOfWeek,
  setActiveTab,
  navigateToToday,
  navigateNext,
  navigatePrevious,
  resetCalendarState
} = calendarSlice.actions;

export default calendarSlice.reducer;
