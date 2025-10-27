import { useSelector, useDispatch } from 'react-redux';
import { BarChart } from '@mui/x-charts/BarChart';
import { setSelectedPipeline } from '../../store/slices/dashboardSlice';
import { useGetDashboardMetricsQuery } from '../../store/services/dashboardApi';
import WidgetCard from './WidgetCard';
import EmptyState from '../common/EmptyState';

function OpportunityValueWidget() {
  const dispatch = useDispatch();
  const { selectedPipelineId, dateRange } = useSelector((state) => state.dashboard);

  const { data, isLoading, error, refetch } = useGetDashboardMetricsQuery({
    pipelineId: selectedPipelineId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  const opportunityValue = data?.data?.opportunityValue || { labels: [], values: [] };
  const hasData = opportunityValue.values.some(v => v > 0);

  const handlePipelineChange = (pipelineId) => {
    dispatch(setSelectedPipeline(pipelineId));
  };

  return (
    <WidgetCard
      title="Opportunity Value"
      loading={isLoading}
      error={error?.message}
      showFilter={true}
      selectedPipelineId={selectedPipelineId}
      onPipelineChange={handlePipelineChange}
      onRefresh={() => refetch()}
    >
      {hasData ? (
        <BarChart
          xAxis={[{ scaleType: 'band', data: opportunityValue.labels }]}
          series={[{ data: opportunityValue.values, color: '#2196f3' }]}
          height={250}
        />
      ) : (
        <EmptyState message="No Data Found" />
      )}
    </WidgetCard>
  );
}

export default OpportunityValueWidget;
