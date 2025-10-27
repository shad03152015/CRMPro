import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['DashboardMetrics', 'Opportunities', 'Pipelines', 'Stages'],
  endpoints: (builder) => ({
    // Get dashboard metrics
    getDashboardMetrics: builder.query({
      query: ({ pipelineId, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (pipelineId) params.append('pipelineId', pipelineId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const queryString = params.toString();
        return `/dashboard/metrics${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['DashboardMetrics'],
      // Cache for 60 seconds
      keepUnusedDataFor: 60
    }),

    // Get opportunities
    getOpportunities: builder.query({
      query: ({ pipelineId, stageId, status, limit = 50, skip = 0 } = {}) => {
        const params = new URLSearchParams();
        if (pipelineId) params.append('pipelineId', pipelineId);
        if (stageId) params.append('stageId', stageId);
        if (status) params.append('status', status);
        params.append('limit', limit);
        params.append('skip', skip);
        return `/opportunities?${params.toString()}`;
      },
      providesTags: ['Opportunities'],
      // Cache for 30 seconds
      keepUnusedDataFor: 30
    }),

    // Get pipelines
    getPipelines: builder.query({
      query: () => '/pipelines',
      providesTags: ['Pipelines'],
      // Cache for 5 minutes
      keepUnusedDataFor: 300
    }),

    // Get stages
    getStages: builder.query({
      query: (pipelineId) => `/stages/${pipelineId}`,
      providesTags: ['Stages'],
      // Cache for 5 minutes
      keepUnusedDataFor: 300
    }),

    // Create opportunity
    createOpportunity: builder.mutation({
      query: (data) => ({
        url: '/opportunities',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Opportunities', 'DashboardMetrics']
    }),

    // Update opportunity
    updateOpportunity: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/opportunities/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Opportunities', 'DashboardMetrics']
    }),

    // Delete opportunity
    deleteOpportunity: builder.mutation({
      query: (id) => ({
        url: `/opportunities/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Opportunities', 'DashboardMetrics']
    })
  })
});

export const {
  useGetDashboardMetricsQuery,
  useGetOpportunitiesQuery,
  useGetPipelinesQuery,
  useGetStagesQuery,
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation
} = dashboardApi;
