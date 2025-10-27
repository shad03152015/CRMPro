import { useSelector, useDispatch } from 'react-redux';
import { PieChart } from '@mui/x-charts/PieChart';
import { setSelectedPipeline } from '../../store/slices/dashboardSlice';
import { useGetDashboardMetricsQuery } from '../../store/services/dashboardApi';
import WidgetCard from './WidgetCard';
import EmptyState from '../common/EmptyState';

function OpportunityStatusWidget() {
  const dispatch = useDispatch();
  const { selectedPipelineId, dateRange } = useSelector((state) => state.dashboard);

  const { data, isLoading, error, refetch } = useGetDashboardMetricsQuery({
    pipelineId: selectedPipelineId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  const opportunityStatus = data?.data?.opportunityStatus || { labels: [], values: [] };
  const hasData = opportunityStatus.values.some(v => v > 0);

  const chartData = opportunityStatus.labels.map((label, index) => ({
    id: index,
    label,
    value: opportunityStatus.values[index]
  }));

  const handlePipelineChange = (pipelineId) => {
    dispatch(setSelectedPipeline(pipelineId));
  };

  return (
    <WidgetCard
      title="Opportunity Status"
      loading={isLoading}
      error={error?.message}
      showFilter={true}
      selectedPipelineId={selectedPipelineId}
      onPipelineChange={handlePipelineChange}
      onRefresh={() => refetch()}
    >
      {hasData ? (
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30 }
            }
          ]}
          height={250}
          colors={['#2196f3', '#4caf50', '#f44336']}
        />
      ) : (
        <EmptyState message="No Data Found" />
      )}
    </WidgetCard>
  );
}

export default OpportunityStatusWidget;
