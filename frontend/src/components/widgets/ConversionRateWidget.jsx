import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { useGetDashboardMetricsQuery } from '../../store/services/dashboardApi';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import WidgetCard from './WidgetCard';

function ConversionRateWidget() {
  const { selectedPipelineId, dateRange } = useSelector((state) => state.dashboard);

  const { data, isLoading, error, refetch } = useGetDashboardMetricsQuery({
    pipelineId: selectedPipelineId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  const conversionRate = data?.data?.conversionRate || {
    percentage: 0,
    wonRevenue: 0,
    change: 0
  };

  return (
    <WidgetCard
      title="Conversion Rate"
      loading={isLoading}
      error={error?.message}
      showFilter={false}
      onRefresh={() => refetch()}
    >
      <Box className="flex flex-col items-center">
        {/* Gauge Chart */}
        <Gauge
          value={conversionRate.percentage}
          valueMin={0}
          valueMax={100}
          height={180}
          width={180}
          text={({ value }) => `${value}%`}
        />

        {/* Metrics */}
        <Box className="mt-4 text-center">
          <Typography variant="body2" className="text-gray-600">
            {formatCurrency(conversionRate.wonRevenue)} vs Last 31 Days
          </Typography>

          {/* Change Indicator */}
          <Box className="flex items-center justify-center gap-1 mt-2">
            {conversionRate.change >= 0 ? (
              <>
                <TrendingUp className="text-green-500" fontSize="small" />
                <Typography variant="body2" className="text-green-500 font-medium">
                  +{formatPercentage(conversionRate.change)}
                </Typography>
              </>
            ) : (
              <>
                <TrendingDown className="text-red-500" fontSize="small" />
                <Typography variant="body2" className="text-red-500 font-medium">
                  {formatPercentage(conversionRate.change)}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </WidgetCard>
  );
}

export default ConversionRateWidget;
