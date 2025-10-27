import { Box, Card, CardContent, IconButton, Typography, CircularProgress } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import EmptyState from '../common/EmptyState';
import PipelineFilter from './PipelineFilter';

function WidgetCard({
  title,
  children,
  loading = false,
  error = null,
  showFilter = false,
  selectedPipelineId = null,
  onPipelineChange = null,
  onRefresh = null,
  emptyMessage = 'No Data Found',
  emptyIcon = null
}) {
  return (
    <Card className="widget-card">
      {/* Header Section */}
      <Box className="flex items-center justify-between mb-4">
        <Typography className="widget-title">
          {title}
        </Typography>

        <Box className="flex items-center gap-2">
          {/* Pipeline Filter */}
          {showFilter && onPipelineChange && (
            <PipelineFilter
              selectedPipelineId={selectedPipelineId}
              onChange={onPipelineChange}
            />
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <IconButton size="small" onClick={onRefresh} className="text-gray-600">
              <Refresh fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Content Section */}
      <CardContent className="p-0">
        {loading ? (
          <Box className="flex items-center justify-center py-12">
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <EmptyState message="Error loading data" subMessage={error} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

export default WidgetCard;
