/**
 * Composants Responsive Réutilisables
 * Utilisez ces composants pour garantir un design responsive cohérent
 */

import React from 'react';
import {
  Card,
  Grid,
  Stack,
  Box,
  Paper,
  Container,
  Dialog,
  useTheme,
  useMediaQuery,
} from '@mui/material';

/**
 * Card responsive avec padding adaptatif
 */
export const ResponsiveCard = ({ children, ...props }) => (
  <Card
    sx={{
      p: { xs: 2, sm: 3, md: 4 },
      mb: { xs: 2, sm: 3 },
      borderRadius: 2,
      boxShadow: 2,
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Card>
);

/**
 * Paper responsive avec padding adaptatif
 */
export const ResponsivePaper = ({ children, ...props }) => (
  <Paper
    sx={{
      p: { xs: 2, sm: 3, md: 4 },
      mb: { xs: 2, sm: 3 },
      borderRadius: 2,
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Paper>
);

/**
 * Container responsive avec padding adaptatif
 */
export const ResponsiveContainer = ({ children, ...props }) => (
  <Container
    maxWidth="lg"
    sx={{
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, sm: 3, md: 4 },
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Container>
);

/**
 * Grid responsive avec colonnes adaptatives
 * Usage: <ResponsiveGrid cols={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
 */
export const ResponsiveGrid = ({ 
  children, 
  cols = { xs: 12, sm: 6, md: 4, lg: 3 },
  spacing = { xs: 2, sm: 3 },
  ...props 
}) => (
  <Grid container spacing={spacing} {...props}>
    {React.Children.map(children, (child) => (
      <Grid item {...cols}>
        {child}
      </Grid>
    ))}
  </Grid>
);

/**
 * Stack responsive avec direction adaptative
 */
export const ResponsiveStack = ({ 
  children, 
  direction = { xs: 'column', sm: 'row' },
  spacing = { xs: 2, sm: 3 },
  ...props 
}) => (
  <Stack
    direction={direction}
    spacing={spacing}
    {...props}
  >
    {children}
  </Stack>
);

/**
 * Dialog responsive (plein écran sur mobile)
 */
export const ResponsiveDialog = ({ children, open, onClose, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: '100%', sm: '90vh' },
          borderRadius: { xs: 0, sm: 2 },
          ...props.PaperProps?.sx,
        },
      }}
      {...props}
    >
      {children}
    </Dialog>
  );
};

/**
 * Box responsive avec padding adaptatif
 */
export const ResponsiveBox = ({ children, ...props }) => (
  <Box
    sx={{
      p: { xs: 2, sm: 3, md: 4 },
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

/**
 * Section responsive pour les pages
 */
export const ResponsiveSection = ({ children, ...props }) => (
  <Box
    sx={{
      py: { xs: 4, sm: 6, md: 8 },
      px: { xs: 2, sm: 3, md: 4 },
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

/**
 * Stats Card responsive pour les dashboards
 */
export const StatsCard = ({ title, value, icon, color = 'primary', ...props }) => (
  <Card
    sx={{
      p: { xs: 2, sm: 3 },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: 2,
      boxShadow: 2,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: 4,
        transform: 'translateY(-4px)',
      },
      ...props.sx,
    }}
    {...props}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Box
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            mb: 1,
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            color: `${color}.main`,
          }}
        >
          {value}
        </Box>
      </Box>
      {icon && (
        <Box
          sx={{
            color: `${color}.main`,
            bgcolor: `${color}.lighter`,
            p: { xs: 1, sm: 1.5 },
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      )}
    </Stack>
  </Card>
);

/**
 * Form Section responsive
 */
export const FormSection = ({ title, children, ...props }) => (
  <Box sx={{ mb: { xs: 3, sm: 4 }, ...props.sx }} {...props}>
    {title && (
      <Box
        sx={{
          fontSize: { xs: '1rem', sm: '1.125rem' },
          fontWeight: 600,
          mb: 2,
          color: 'primary.main',
        }}
      >
        {title}
      </Box>
    )}
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      {children}
    </Grid>
  </Box>
);

/**
 * Action Buttons responsive (pour formulaires)
 */
export const ActionButtons = ({ children, ...props }) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={{ xs: 2, sm: 3 }}
    sx={{
      mt: { xs: 3, sm: 4 },
      justifyContent: 'flex-end',
      ...props.sx,
    }}
    {...props}
  >
    {React.Children.map(children, (child) =>
      React.cloneElement(child, {
        fullWidth: child.props.fullWidth !== false,
        sx: {
          ...child.props.sx,
          width: { xs: '100%', sm: 'auto' },
        },
      })
    )}
  </Stack>
);

/**
 * Page Header responsive
 */
export const PageHeader = ({ title, subtitle, actions, ...props }) => (
  <Box
    sx={{
      mb: { xs: 3, sm: 4 },
      ...props.sx,
    }}
    {...props}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={{ xs: 2, sm: 3 }}
    >
      <Box>
        <Box
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            mb: subtitle ? 1 : 0,
          }}
        >
          {title}
        </Box>
        {subtitle && (
          <Box
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              color: 'text.secondary',
            }}
          >
            {subtitle}
          </Box>
        )}
      </Box>
      {actions && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {actions}
        </Stack>
      )}
    </Stack>
  </Box>
);

/**
 * Empty State responsive
 */
export const EmptyState = ({ icon, title, description, action, ...props }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: { xs: 6, sm: 8, md: 10 },
      px: { xs: 2, sm: 3 },
      ...props.sx,
    }}
    {...props}
  >
    {icon && (
      <Box
        sx={{
          fontSize: { xs: 48, sm: 64, md: 80 },
          color: 'text.secondary',
          mb: 2,
        }}
      >
        {icon}
      </Box>
    )}
    <Box
      sx={{
        fontSize: { xs: '1.25rem', sm: '1.5rem' },
        fontWeight: 600,
        mb: 1,
        color: 'text.primary',
      }}
    >
      {title}
    </Box>
    {description && (
      <Box
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem' },
          color: 'text.secondary',
          mb: action ? 3 : 0,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        {description}
      </Box>
    )}
    {action && <Box sx={{ mt: 3 }}>{action}</Box>}
  </Box>
);

/**
 * Loading State responsive
 */
export const LoadingState = ({ message = 'Chargement...', ...props }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: { xs: 6, sm: 8, md: 10 },
      px: { xs: 2, sm: 3 },
      ...props.sx,
    }}
    {...props}
  >
    <Box
      sx={{
        width: { xs: 40, sm: 48 },
        height: { xs: 40, sm: 48 },
        border: 4,
        borderColor: 'primary.main',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        mb: 2,
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    />
    <Box
      sx={{
        fontSize: { xs: '0.875rem', sm: '1rem' },
        color: 'text.secondary',
      }}
    >
      {message}
    </Box>
  </Box>
);

/**
 * Hook pour détecter la taille de l'écran
 */
export const useResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
};

export default {
  ResponsiveCard,
  ResponsivePaper,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveDialog,
  ResponsiveBox,
  ResponsiveSection,
  StatsCard,
  FormSection,
  ActionButtons,
  PageHeader,
  EmptyState,
  LoadingState,
  useResponsive,
};
