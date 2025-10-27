import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  activeMenuItem: 'Dashboard',
  theme: 'light' // for future dark mode implementation
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setActiveMenuItem: (state, action) => {
      state.activeMenuItem = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    }
  }
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setActiveMenuItem,
  setTheme
} = uiSlice.actions;

export default uiSlice.reducer;
