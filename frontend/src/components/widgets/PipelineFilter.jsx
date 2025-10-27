import { FormControl, Select, MenuItem, CircularProgress } from '@mui/material';
import { useGetPipelinesQuery } from '../../store/services/dashboardApi';

function PipelineFilter({ selectedPipelineId, onChange }) {
  const { data: pipelinesData, isLoading } = useGetPipelinesQuery();
  const pipelines = pipelinesData?.data || [];

  if (isLoading) {
    return <CircularProgress size={20} />;
  }

  return (
    <FormControl size="small" className="min-w-[150px]">
      <Select
        value={selectedPipelineId || 'all'}
        onChange={(e) => onChange(e.target.value === 'all' ? null : e.target.value)}
        displayEmpty
      >
        <MenuItem value="all">All Pipelines</MenuItem>
        {pipelines.map((pipeline) => (
          <MenuItem key={pipeline._id} value={pipeline._id}>
            {pipeline.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default PipelineFilter;
