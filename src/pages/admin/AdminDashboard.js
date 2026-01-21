import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Skeleton,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  CalendarToday,
  BarChart,
  TrendingUp,
  LocalHospital,
  PersonAdd,
  ArrowForward,
  Notifications,
  AccessTime,
  Settings,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import UsersManagement from './UsersManagement';
import Statistics from './Statistics';
import AllRendezVous from './AllRendezVous';
import ClinicConfig from './ClinicConfig';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/statistiques');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <DashboardIcon />, path: '/admin' },
    { id: 'users', label: 'Gestion Utilisateurs', icon: <People />, path: '/admin/users' },
    { id: 'rendezvous', label: 'Rendez-vous', icon: <CalendarToday />, path: '/admin/rendezvous' },
    { id: 'statistics', label: 'Statistiques', icon: <BarChart />, path: '/admin/statistics' },
    { id: 'config', label: 'Configuration Clinique', icon: <Settings />, path: '/admin/config' },
  ];

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.patients?.total || 0,
      icon: <LocalHospital />,
      color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      change: '+12%',
      changeColor: 'success',
    },
    {
      title: 'Médecins Actifs',
      value: stats?.utilisateurs?.medecins || 0,
      icon: <People />,
      color: 'linear-gradient(135deg, #22c55e, #16a34a)',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      change: '+5%',
      changeColor: 'success',
    },
    {
      title: 'RDV Aujourd\'hui',
      value: stats?.rendezvous?.aujourdhui || 0,
      icon: <CalendarToday />,
      color: 'linear-gradient(135deg, #a855f7, #9333ea)',
      bgColor: 'rgba(168, 85, 247, 0.1)',
      change: '+8%',
      changeColor: 'success',
    },
    {
      title: 'Consultations/Mois',
      value: stats?.consultations?.ce_mois || 0,
      icon: <TrendingUp />,
      color: 'linear-gradient(135deg, #f97316, #ea580c)',
      bgColor: 'rgba(249, 115, 22, 0.1)',
      change: '+15%',
      changeColor: 'success',
    },
  ];

  const quickActions = [
    {
      title: 'Ajouter un utilisateur',
      description: 'Créer un nouveau compte',
      icon: <PersonAdd />,
      color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      path: '/admin/users',
    },
    {
      title: 'Voir les rendez-vous',
      description: 'Gérer les RDV',
      icon: <CalendarToday />,
      color: 'linear-gradient(135deg, #22c55e, #16a34a)',
      path: '/admin/rendezvous',
    },
    {
      title: 'Statistiques',
      description: 'Analyser les données',
      icon: <BarChart />,
      color: 'linear-gradient(135deg, #a855f7, #9333ea)',
      path: '/admin/statistics',
    },
  ];

  const recentActivities = [
    { action: 'Nouveau patient inscrit', time: 'Il y a 5 min', type: 'patient', color: '#3b82f6' },
    { action: 'Rendez-vous confirmé', time: 'Il y a 15 min', type: 'rdv', color: '#22c55e' },
    { action: 'Nouveau médecin ajouté', time: 'Il y a 1h', type: 'user', color: '#a855f7' },
  ];

  return (
    <Layout menuItems={menuItems} title="Administration">
      <Routes>
        <Route
          path="/"
          element={
            <Box sx={{ py: 3 }}>
              <Container maxWidth="xl">
                <Stack spacing={4}>
                  {/* Welcome Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                        color: 'white',
                        p: { xs: 4, md: 6 },
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -50,
                          right: -50,
                          width: 200,
                          height: 200,
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          zIndex: 0,
                        }}
                      />
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            fontSize: { xs: '1.75rem', md: '2.5rem' },
                          }}
                        >
                          Bienvenue dans l'administration
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            opacity: 0.9,
                            fontSize: { xs: '1rem', md: '1.25rem' },
                          }}
                        >
                          Gérez votre clinique médicale en toute simplicité
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>

                  {/* Stats Cards */}
                  <Grid container spacing={3}>
                    {loading
                      ? [1, 2, 3, 4].map((i) => (
                          <Grid item xs={12} sm={6} md={3} key={i}>
                            <Card>
                              <CardContent>
                                <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
                                <Skeleton variant="text" width="60%" height={40} />
                                <Skeleton variant="text" width="40%" />
                              </CardContent>
                            </Card>
                          </Grid>
                        ))
                      : statCards.map((stat, index) => (
                          <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card
                                sx={{
                                  height: '100%',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6,
                                  },
                                }}
                              >
                                <CardContent>
                                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Avatar
                                      sx={{
                                        width: 56,
                                        height: 56,
                                        background: stat.color,
                                      }}
                                    >
                                      {stat.icon}
                                    </Avatar>
                                    <Chip
                                      label={stat.change}
                                      size="small"
                                      color={stat.changeColor}
                                      sx={{ fontWeight: 600 }}
                                    />
                                  </Stack>
                                  <Typography
                                    variant="h3"
                                    sx={{
                                      fontWeight: 'bold',
                                      mb: 0.5,
                                      fontSize: { xs: '2rem', md: '2.5rem' },
                                    }}
                                  >
                                    {stat.value}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {stat.title}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}
                  </Grid>

                  {/* Quick Actions */}
                  <Grid container spacing={3}>
                    {quickActions.map((action, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            sx={{
                              height: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: 6,
                                transform: 'translateY(-2px)',
                              },
                            }}
                            onClick={() => navigate(action.path)}
                          >
                            <CardContent>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    background: action.color,
                                  }}
                                >
                                  {action.icon}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {action.title}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {action.description}
                                  </Typography>
                                </Box>
                                <IconButton
                                  sx={{
                                    color: 'primary.main',
                                  }}
                                >
                                  <ArrowForward />
                                </IconButton>
                              </Stack>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Recent Activity */}
                  <Card>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                        <Notifications sx={{ color: 'primary.main' }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          Activité récente
                        </Typography>
                      </Stack>
                      <Divider sx={{ mb: 3 }} />
                      <Stack spacing={2}>
                        {recentActivities.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: 'grey.50',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: 'grey.100',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: activity.color,
                                  }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {activity.action}
                                  </Typography>
                                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                                    <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      {activity.time}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Stack>
                            </Paper>
                          </motion.div>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Container>
            </Box>
          }
        />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/rendezvous" element={<AllRendezVous />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/config" element={<ClinicConfig />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;
