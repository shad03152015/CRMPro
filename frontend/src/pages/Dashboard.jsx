import { Box } from '@mui/material';
import MainLayout from '../layouts/MainLayout';
import OpportunityStatusWidget from '../components/widgets/OpportunityStatusWidget';
import OpportunityValueWidget from '../components/widgets/OpportunityValueWidget';
import ConversionRateWidget from '../components/widgets/ConversionRateWidget';
import FunnelWidget from '../components/widgets/FunnelWidget';
import StageDistributionWidget from '../components/widgets/StageDistributionWidget';
import ErrorBoundary from '../components/common/ErrorBoundary';

function Dashboard() {
  return (
    <MainLayout>
      <ErrorBoundary>
        {/* Row 1: 3 equal columns */}
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <OpportunityStatusWidget />
          <OpportunityValueWidget />
          <ConversionRateWidget />
        </Box>

        {/* Row 2: 1fr + 2fr columns */}
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Box className="md:col-span-1">
            <FunnelWidget />
          </Box>
          <Box className="md:col-span-2">
            <StageDistributionWidget />
          </Box>
        </Box>
      </ErrorBoundary>
    </MainLayout>
  );
}

export default Dashboard;
