import { useSelector, useDispatch } from 'react-redux';
import { BarChart } from '@mui/x-charts/BarChart';
import { Lock } from '@mui/icons-material';
import { setSelectedPipeline } from '../../store/slices/dashboardSlice';
import { useGetDashboardMetricsQuery } from '../../store/services/dashboardApi';
import WidgetCard from './WidgetCard';
import EmptyState from '../common/EmptyState';

function StageDistributionWidget() {
  const dispatch = useDispatch();
  const { selectedPipelineId, dateRange } = useSelector((state) => state.dashboard);

  const { data, isLoading, error, refetch } = useGetDashboardMetricsQuery({
    pipelineId: selectedPipelineId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  const stageDistribution = data?.data?.stageDistribution || { labels: [], values: [] };
  const hasData = stageDistribution.values.some(v => v > 0);

  const handlePipelineChange = (pipelineId) => {
    dispatch(setSelectedPipeline(pipelineId));
  };

  return (
    <WidgetCard
      title="Stage Distribution"
      loading={isLoading}
      error={error?.message}
      showFilter={true}
      selectedPipelineId={selectedPipelineId}
      onPipelineChange={handlePipelineChange}
      onRefresh={() => refetch()}
    >
      {hasData ? (
        <BarChart
          xAxis={[{ scaleType: 'band', data: stageDistribution.labels }]}
          series={[{ data: stageDistribution.values, color: '#9c27b0' }]}
          height={250}
          layout="horizontal"
        />
      ) : (
        <EmptyState
          icon={Lock}
          message="No pipeline available"
          subMessage="Select a pipeline to view stage distribution"
        />
      )}
    </WidgetCard>
  );
}

export default StageDistributionWidget;
