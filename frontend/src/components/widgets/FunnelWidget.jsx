import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { setSelectedPipeline } from '../../store/slices/dashboardSlice';
import { useGetDashboardMetricsQuery } from '../../store/services/dashboardApi';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import WidgetCard from './WidgetCard';
import EmptyState from '../common/EmptyState';

function FunnelWidget() {
  const dispatch = useDispatch();
  const { selectedPipelineId, dateRange } = useSelector((state) => state.dashboard);

  const { data, isLoading, error, refetch } = useGetDashboardMetricsQuery({
    pipelineId: selectedPipelineId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  const funnel = data?.data?.funnel || {
    totalValue: 0,
    conversionPercentage: 0,
    stages: []
  };

  const hasData = funnel.stages.length > 0;

  const handlePipelineChange = (pipelineId) => {
    dispatch(setSelectedPipeline(pipelineId));
  };

  return (
    <WidgetCard
      title="Funnel"
      loading={isLoading}
      error={error?.message}
      showFilter={true}
      selectedPipelineId={selectedPipelineId}
      onPipelineChange={handlePipelineChange}
      onRefresh={() => refetch()}
    >
      {hasData ? (
        <Box className="flex flex-col items-center justify-center py-8">
          <Typography variant="h3" className="font-bold text-gray-900">
            {formatCurrency(funnel.totalValue)}
          </Typography>
          <Typography variant="h5" className="text-green-500 font-semibold mt-2">
            {formatPercentage(funnel.conversionPercentage)}
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            Conversion Rate
          </Typography>
        </Box>
      ) : (
        <EmptyState
          icon={Lock}
          message="No pipeline available"
          subMessage="Select a pipeline to view funnel metrics"
        />
      )}
    </WidgetCard>
  );
}

export default FunnelWidget;
