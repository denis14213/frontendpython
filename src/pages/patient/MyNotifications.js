import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Notifications,
  NotificationsActive,
  AccessTime,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import axios from 'axios';

const MyNotifications = ({ onUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/patient/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notifId) => {
    try {
      await axios.post(`/patient/notifications/${notifId}/read`);
      fetchNotifications();
      if (onUpdate) onUpdate();
      toast.success('Notification marquée comme lue');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.is_read);
      await Promise.all(
        unreadNotifications.map((n) => axios.post(`/patient/notifications/${n._id}/read`))
      );
      fetchNotifications();
      if (onUpdate) onUpdate();
      toast.success('Toutes les notifications ont été marquées comme lues');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Mes Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {unreadCount > 0
                ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                : 'Toutes vos notifications'}
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Chip
              label="Marquer tout comme lu"
              onClick={handleMarkAllAsRead}
              color="primary"
              clickable
            />
          )}
        </Box>

        {/* Notifications */}
        {notifications.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Aucune notification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vous n'avez pas encore de notifications
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {notifications.map((notif, index) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  sx={{
                    borderLeft: notif.is_read ? 0 : 4,
                    borderColor: 'primary.main',
                    bgcolor: notif.is_read ? 'background.paper' : 'primary.50',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: notif.is_read ? 'grey.400' : 'primary.main',
                          width: 48,
                          height: 48,
                        }}
                      >
                        {notif.is_read ? <Notifications /> : <NotificationsActive />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {notif.titre}
                          </Typography>
                          {!notif.is_read && (
                            <Chip label="Nouveau" color="primary" size="small" />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {notif.message}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {notif.date_creation
                              ? format(new Date(notif.date_creation), "d MMMM yyyy 'à' HH:mm", {
                                  locale: fr,
                                })
                              : 'Date inconnue'}
                          </Typography>
                        </Stack>
                      </Box>
                      {!notif.is_read && (
                        <Tooltip title="Marquer comme lu">
                          <IconButton
                            color="primary"
                            onClick={() => handleMarkAsRead(notif._id)}
                            sx={{
                              bgcolor: 'primary.50',
                              '&:hover': {
                                bgcolor: 'primary.100',
                              },
                            }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default MyNotifications;
