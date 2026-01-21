import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Logout,
  Menu as MenuIcon,
  LocalHospital,
  Notifications,
  Close,
} from '@mui/icons-material';

const drawerWidth = 280;

const Layout = ({ children, menuItems = [], title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success('Déconnexion réussie');
      navigate('/');
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'linear-gradient(135deg, #ef4444, #dc2626)',
      medecin: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      secretaire: 'linear-gradient(135deg, #22c55e, #16a34a)',
      patient: 'linear-gradient(135deg, #a855f7, #9333ea)',
    };
    return colors[role] || 'linear-gradient(135deg, #6b7280, #4b5563)';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background: getRoleColor(user?.role),
          }}
        >
          <LocalHospital />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Clinique
          </Typography>
          <Typography variant="caption" sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>
            {user?.role}
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => {
          // Vérifier si l'item est actif
          const isActive = 
            location.pathname === item.path || 
            (item.path !== '/admin' && item.path !== '/medecin' && item.path !== '/patient' && item.path !== '/secretaire' && location.pathname.startsWith(item.path + '/')) ||
            (item.path === '/admin' && location.pathname.startsWith('/admin')) ||
            (item.path === '/medecin' && location.pathname.startsWith('/medecin') && !location.pathname.startsWith('/medecin/')) ||
            (item.path === '/patient' && location.pathname.startsWith('/patient') && !location.pathname.startsWith('/patient/')) ||
            (item.path === '/secretaire' && location.pathname.startsWith('/secretaire') && !location.pathname.startsWith('/secretaire/'));
          
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Section */}
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: getRoleColor(user?.role),
              fontWeight: 'bold',
            }}
          >
            {user?.prenom?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {user?.prenom} {user?.nom}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Stack>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          Déconnexion
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user?.prenom} {user?.nom}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {user?.role}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: getRoleColor(user?.role),
                  fontWeight: 'bold',
                }}
              >
                {user?.prenom?.[0] || 'U'}
              </Avatar>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'grey.50',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
