import { createSlice } from '@reduxjs/toolkit';

// Calculate date range for last 31 days
const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 31);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

const initialState = {
  selectedPipelineId: null, // null = "All Pipelines"
  dateRange: getDefaultDateRange(),
  isRefreshing: false
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedPipeline: (state, action) => {
      state.selectedPipelineId = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    resetDashboard: (state) => {
      state.selectedPipelineId = null;
      state.dateRange = getDefaultDateRange();
      state.isRefreshing = false;
    }
  }
});

export const {
  setSelectedPipeline,
  setDateRange,
  setRefreshing,
  resetDashboard
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
