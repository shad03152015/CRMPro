/**
 * Application constants
 */

// Navigation menu items
export const MENU_ITEMS = [
  { label: 'Launchpad', icon: 'RocketLaunch', path: '/launchpad' },
  { label: 'Dashboard', icon: 'Dashboard', path: '/dashboard' },
  { label: 'Conversations', icon: 'Chat', path: '/conversations' },
  { label: 'Calendars', icon: 'CalendarToday', path: '/calendars' },
  { label: 'Contacts', icon: 'Contacts', path: '/contacts' },
  { label: 'Opportunities', icon: 'TrendingUp', path: '/opportunities' },
  { label: 'Payments', icon: 'Payment', path: '/payments' },
];

export const EXTENDED_MENU_ITEMS = [
  { label: 'AI Agents', icon: 'SmartToy', path: '/ai-agents' },
  { label: 'Marketing', icon: 'Campaign', path: '/marketing' },
  { label: 'Automation', icon: 'AutoMode', path: '/automation' },
  { label: 'Stores', icon: 'Store', path: '/stores' },
  { label: 'Memberships', icon: 'CardMembership', path: '/memberships' },
  { label: 'Media Storage', icon: 'Folder', path: '/media-storage' },
  { label: 'Reputation', icon: 'Star', path: '/reputation' },
  { label: 'Reporting', icon: 'Assessment', path: '/reporting' },
  { label: 'App Marketplace', icon: 'Apps', path: '/marketplace' },
];

// Chart colors
export const CHART_COLORS = {
  blue: '#2196f3',
  green: '#4caf50',
  orange: '#ff9800',
  red: '#f44336',
  purple: '#9c27b0',
  teal: '#009688',
  gray: '#9e9e9e'
};

// Opportunity statuses
export const OPPORTUNITY_STATUS = {
  OPEN: 'open',
  WON: 'won',
  LOST: 'lost'
};

// Default date range (last 31 days)
export const DEFAULT_DATE_RANGE_DAYS = 31;
