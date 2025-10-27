import { Box, Typography } from '@mui/material';
import { SearchOff } from '@mui/icons-material';

function EmptyState({ icon: Icon = SearchOff, message = 'No Data Found', subMessage = '' }) {
  return (
    <Box className="empty-state">
      <Icon className="text-6xl mb-4 text-gray-300" />
      <Typography variant="h6" className="font-medium text-gray-500">
        {message}
      </Typography>
      {subMessage && (
        <Typography variant="body2" className="text-gray-400 mt-1">
          {subMessage}
        </Typography>
      )}
    </Box>
  );
}

export default EmptyState;
