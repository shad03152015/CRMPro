import { Box, Typography, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setDateRange } from '../../store/slices/dashboardSlice';

function TopHeader() {
  const { dateRange } = useSelector((state) => state.dashboard);
  const activeMenuItem = useSelector((state) => state.ui.activeMenuItem);
  const dispatch = useDispatch();

  const handleStartDateChange = (e) => {
    dispatch(setDateRange({
      ...dateRange,
      startDate: e.target.value
    }));
  };

  const handleEndDateChange = (e) => {
    dispatch(setDateRange({
      ...dateRange,
      endDate: e.target.value
    }));
  };

  return (
    <Box className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Page Title */}
      <Typography variant="h5" className="font-semibold text-gray-900">
        {activeMenuItem}
      </Typography>

      {/* Date Range Selector (only show on Dashboard) */}
      {activeMenuItem === 'Dashboard' && (
        <Box className="flex items-center gap-3">
          <TextField
            type="date"
            size="small"
            value={dateRange.startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            className="w-40"
          />
          <Typography variant="body2" className="text-gray-600">
            to
          </Typography>
          <TextField
            type="date"
            size="small"
            value={dateRange.endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            className="w-40"
          />
        </Box>
      )}
    </Box>
  );
}

export default TopHeader;
