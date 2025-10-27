import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { dashboardApi } from './services/dashboardApi';
import dashboardReducer from './slices/dashboardSlice';
import uiReducer from './slices/uiSlice';
import calendarReducer from './slices/calendarSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    // Custom slices
    dashboard: dashboardReducer,
    ui: uiReducer,
    calendar: calendarReducer
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dashboardApi.middleware),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production'
});

// Optional: Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
