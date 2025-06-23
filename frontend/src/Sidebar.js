import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Box, Divider } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link, useLocation } from 'react-router-dom';
import MotivationalQuote from './MotivationalQuote';
import StreakTracker from './StreakTracker';

const drawerWidth = 240;

const Sidebar = ({ mode, toggleTheme, todos = [] }) => {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 'none',
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/favicon.ico" alt="Logo" width={32} height={32} />
          <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ letterSpacing: 1 }}>
            Todo AI
          </Typography>
        </Box>
        <Box sx={{ px: 2 }}>
          <MotivationalQuote />
          <StreakTracker todos={todos} />
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1, mt: 2 }}>
          <ListItem button component={Link} to="/" selected={location.pathname === '/'} sx={{ borderRadius: 2, mb: 1 }}>
            <ListItemIcon>
              <ListAltIcon color={location.pathname === '/' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Todos" />
          </ListItem>
          <ListItem button component={Link} to="/analytics" selected={location.pathname === '/analytics'} sx={{ borderRadius: 2 }}>
            <ListItemIcon>
              <InsightsIcon color={location.pathname === '/analytics' ? 'secondary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
        </List>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 