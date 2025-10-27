import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['DashboardMetrics', 'Opportunities', 'Pipelines', 'Stages', 'Calendars', 'Appointments', 'Contacts', 'Conversations', 'Messages'],
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
    }),

    // Get calendars
    getCalendars: builder.query({
      query: () => '/calendars',
      providesTags: ['Calendars'],
      keepUnusedDataFor: 300
    }),

    // Get single calendar
    getCalendar: builder.query({
      query: (id) => `/calendars/${id}`,
      providesTags: ['Calendars']
    }),

    // Create calendar
    createCalendar: builder.mutation({
      query: (data) => ({
        url: '/calendars',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Calendars']
    }),

    // Update calendar
    updateCalendar: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/calendars/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Calendars']
    }),

    // Delete calendar
    deleteCalendar: builder.mutation({
      query: (id) => ({
        url: `/calendars/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Calendars']
    }),

    // Get appointments
    getAppointments: builder.query({
      query: ({ calendarId, startDate, endDate, status, limit = 100, skip = 0 } = {}) => {
        const params = new URLSearchParams();
        if (calendarId) params.append('calendarId', calendarId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (status) params.append('status', status);
        params.append('limit', limit);
        params.append('skip', skip);
        return `/appointments?${params.toString()}`;
      },
      providesTags: ['Appointments'],
      keepUnusedDataFor: 30
    }),

    // Create appointment
    createAppointment: builder.mutation({
      query: (data) => ({
        url: '/appointments',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Appointments', 'Calendars']
    }),

    // Update appointment
    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/appointments/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Appointments', 'Calendars']
    }),

    // Delete appointment
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Appointments', 'Calendars']
    }),

    // Update appointment status
    updateAppointmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/appointments/${id}/status`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: ['Appointments', 'Calendars']
    }),

    // Get contacts
    getContacts: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            params.append(key, filters[key]);
          }
        });
        return `/contacts?${params.toString()}`;
      },
      providesTags: ['Contacts'],
      keepUnusedDataFor: 30
    }),

    // Get single contact
    getContact: builder.query({
      query: (id) => `/contacts/${id}`,
      providesTags: ['Contacts']
    }),

    // Create contact
    createContact: builder.mutation({
      query: (data) => ({
        url: '/contacts',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Contacts']
    }),

    // Update contact
    updateContact: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/contacts/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Contacts']
    }),

    // Delete contact
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Contacts']
    }),

    // Bulk delete contacts
    bulkDeleteContacts: builder.mutation({
      query: (contactIds) => ({
        url: '/contacts/bulk-delete',
        method: 'POST',
        body: { contactIds }
      }),
      invalidatesTags: ['Contacts']
    }),

    // Bulk update contacts
    bulkUpdateContacts: builder.mutation({
      query: ({ contactIds, updateData }) => ({
        url: '/contacts/bulk-update',
        method: 'POST',
        body: { contactIds, updateData }
      }),
      invalidatesTags: ['Contacts']
    }),

    // Search contacts
    searchContacts: builder.query({
      query: (searchTerm) => `/contacts/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Contacts']
    }),

    // Get contact stats
    getContactStats: builder.query({
      query: () => '/contacts/stats',
      providesTags: ['Contacts']
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
  useDeleteOpportunityMutation,
  useGetCalendarsQuery,
  useGetCalendarQuery,
  useCreateCalendarMutation,
  useUpdateCalendarMutation,
  useDeleteCalendarMutation,
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useBulkDeleteContactsMutation,
  useBulkUpdateContactsMutation,
  useSearchContactsQuery,
  useGetContactStatsQuery
} = dashboardApi;
