import { Box } from '@mui/material';
import Sidebar from '../components/navigation/Sidebar';
import TopHeader from '../components/navigation/TopHeader';

function MainLayout({ children }) {
  return (
    <Box className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <Box className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <TopHeader />

        {/* Page content */}
        <Box className="flex-1 overflow-y-auto p-6">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
