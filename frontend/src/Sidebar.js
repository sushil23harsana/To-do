import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Box, Divider, Tooltip } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, useLocation } from 'react-router-dom';
import MotivationalQuote from './MotivationalQuote';
import StreakTracker from './StreakTracker';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 240;
const miniWidth = 72;

const Sidebar = ({ mode, toggleTheme, todos = [], open = true, onToggle }) => {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : miniWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: 'width 0.3s',
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : miniWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 'none',
          boxShadow: 3,
          overflowX: 'hidden',
          transition: 'width 0.3s',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: open ? 'flex-start' : 'center', px: open ? 0 : 1 }}>
        <Box sx={{ p: open ? 3 : 1.5, display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: open ? 'flex-start' : 'center' }}>
          <img src="/favicon.ico" alt="Logo" width={32} height={32} />
          {open && (
            <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ letterSpacing: 1 }}>
              Todo AI
            </Typography>
          )}
        </Box>
        {open && (
          <Box sx={{ px: 2, width: '100%' }}>
            <MotivationalQuote />
            <StreakTracker todos={todos} />
          </Box>
        )}
        <Divider sx={{ width: '100%', my: 1 }} />
        <List sx={{ flexGrow: 1, mt: 2, width: '100%' }}>
          <Tooltip title="Dashboard" placement="right" disableHoverListener={open} arrow>
            <ListItem button component={Link} to="/dashboard" selected={location.pathname === '/dashboard'} sx={{ borderRadius: 2, mb: 1, justifyContent: open ? 'flex-start' : 'center', px: open ? 2 : 1 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                <DashboardIcon color={location.pathname === '/dashboard' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              {open && <ListItemText primary="Dashboard" />}
            </ListItem>
          </Tooltip>
          <Tooltip title="Todos" placement="right" disableHoverListener={open} arrow>
            <ListItem button component={Link} to="/" selected={location.pathname === '/'} sx={{ borderRadius: 2, mb: 1, justifyContent: open ? 'flex-start' : 'center', px: open ? 2 : 1 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                <ListAltIcon color={location.pathname === '/' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              {open && <ListItemText primary="Todos" />}
            </ListItem>
          </Tooltip>
          <Tooltip title="Analytics" placement="right" disableHoverListener={open} arrow>
            <ListItem button component={Link} to="/analytics" selected={location.pathname === '/analytics'} sx={{ borderRadius: 2, justifyContent: open ? 'flex-start' : 'center', px: open ? 2 : 1 }}>
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                <InsightsIcon color={location.pathname === '/analytics' ? 'secondary' : 'inherit'} />
              </ListItemIcon>
              {open && <ListItemText primary="Analytics" />}
            </ListItem>
          </Tooltip>
        </List>
        <Box sx={{ p: open ? 2 : 1, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <IconButton onClick={toggleTheme} color="inherit" size={open ? 'medium' : 'small'}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <IconButton onClick={onToggle} size="small">
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 