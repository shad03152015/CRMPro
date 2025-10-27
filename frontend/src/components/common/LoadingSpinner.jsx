import { Box, CircularProgress } from '@mui/material';

function LoadingSpinner({ size = 40, fullPage = false }) {
  const content = (
    <Box className="flex items-center justify-center py-12">
      <CircularProgress size={size} />
    </Box>
  );

  if (fullPage) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress size={size} />
      </Box>
    );
  }

  return content;
}

export default LoadingSpinner;
