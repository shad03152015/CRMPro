import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-50">
      <Box className="text-center">
        <Typography variant="h1" className="text-6xl font-bold text-gray-900 mb-4">
          404
        </Typography>
        <Typography variant="h5" className="text-gray-600 mb-6">
          Page Not Found
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/dashboard')}
          className="bg-primary-500"
        >
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
}

export default NotFound;
