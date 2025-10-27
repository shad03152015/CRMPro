import { Box, List, ListItemButton, ListItemIcon, ListItemText, TextField, InputAdornment, Typography, Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveMenuItem } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import {
  RocketLaunch,
  Dashboard,
  Chat,
  CalendarToday,
  Contacts,
  TrendingUp,
  Payment,
  SmartToy,
  Campaign,
  AutoMode,
  Store,
  CardMembership,
  Folder,
  Star,
  Assessment,
  Apps,
  Settings,
  Search
} from '@mui/icons-material';

const mainMenuItems = [
  { label: 'Launchpad', icon: <RocketLaunch />, path: '/launchpad' },
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { label: 'Conversations', icon: <Chat />, path: '/conversations' },
  { label: 'Calendar', icon: <CalendarToday />, path: '/calendar' },
  { label: 'Contacts', icon: <Contacts />, path: '/contacts' },
  { label: 'Opportunities', icon: <TrendingUp />, path: '/opportunities' },
  { label: 'Payments', icon: <Payment />, path: '/payments' },
];

const extendedMenuItems = [
  { label: 'AI Agents', icon: <SmartToy />, path: '/ai-agents' },
  { label: 'Marketing', icon: <Campaign />, path: '/marketing' },
  { label: 'Automation', icon: <AutoMode />, path: '/automation' },
  { label: 'Stores', icon: <Store />, path: '/stores' },
  { label: 'Memberships', icon: <CardMembership />, path: '/memberships' },
  { label: 'Media Storage', icon: <Folder />, path: '/media-storage' },
  { label: 'Reputation', icon: <Star />, path: '/reputation' },
  { label: 'Reporting', icon: <Assessment />, path: '/reporting' },
  { label: 'App Marketplace', icon: <Apps />, path: '/marketplace' },
];

function Sidebar() {
  const activeMenuItem = useSelector((state) => state.ui.activeMenuItem);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuClick = (label, path) => {
    dispatch(setActiveMenuItem(label));
    navigate(path);
  };

  return (
    <Box className="w-60 bg-sidebar-bg text-sidebar-text flex flex-col h-full border-r border-gray-700">
      {/* Logo/Brand */}
      <Box className="p-4 border-b border-gray-700">
        <Typography variant="h5" className="font-bold text-white">
          CRMPro
        </Typography>
      </Box>

      {/* Search */}
      <Box className="p-3">
        <TextField
          fullWidth
          size="small"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="text-gray-400" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" className="text-gray-500">
                  ⌘K
                </Typography>
              </InputAdornment>
            ),
            className: 'bg-sidebar-hover text-sidebar-text rounded'
          }}
        />
      </Box>

      {/* Main Menu Items */}
      <Box className="flex-1 overflow-y-auto">
        <List>
          {mainMenuItems.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => handleMenuClick(item.label, item.path)}
              className={`mx-2 rounded ${
                activeMenuItem === item.label ? 'bg-sidebar-active' : 'hover:bg-sidebar-hover'
              }`}
            >
              <ListItemIcon className={activeMenuItem === item.label ? 'text-white' : 'text-sidebar-text'}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                className={activeMenuItem === item.label ? 'text-white' : 'text-sidebar-text'}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider className="my-2 bg-gray-700" />

        {/* Extended Menu Items */}
        <List>
          {extendedMenuItems.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => handleMenuClick(item.label, item.path)}
              className={`mx-2 rounded ${
                activeMenuItem === item.label ? 'bg-sidebar-active' : 'hover:bg-sidebar-hover'
              }`}
            >
              <ListItemIcon className={activeMenuItem === item.label ? 'text-white' : 'text-sidebar-text'}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                className={activeMenuItem === item.label ? 'text-white' : 'text-sidebar-text'}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Bottom Section - Settings */}
      <Box className="border-t border-gray-700">
        <ListItemButton
          onClick={() => handleMenuClick('Settings', '/settings')}
          className="mx-2 my-2 rounded hover:bg-sidebar-hover"
        >
          <ListItemIcon className="text-sidebar-text">
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" className="text-sidebar-text" />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default Sidebar;
