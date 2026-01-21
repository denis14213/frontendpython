import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Container,
  Stack,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  People,
  LocalHospital,
  CalendarToday,
  TrendingUp,
  BusinessCenter,
  AdminPanelSettings,
  CheckCircle,
  Schedule,
  Assessment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/admin/statistiques');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.patients?.total || 0,
      icon: <People />,
      color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      change: '+12%',
      changeColor: 'success',
    },
    {
      title: 'Médecins Actifs',
      value: stats?.utilisateurs?.medecins || 0,
      icon: <LocalHospital />,
      color: 'linear-gradient(135deg, #22c55e, #16a34a)',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      change: '+5%',
      changeColor: 'success',
    },
    {
      title: 'Secrétaires',
      value: stats?.utilisateurs?.secretaires || 0,
      icon: <BusinessCenter />,
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      change: '+3%',
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
      title: 'RDV Total',
      value: stats?.rendezvous?.total || 0,
      icon: <Assessment />,
      color: 'linear-gradient(135deg, #f97316, #ea580c)',
      bgColor: 'rgba(249, 115, 22, 0.1)',
      change: '+15%',
      changeColor: 'success',
    },
    {
      title: 'Consultations/Mois',
      value: stats?.consultations?.ce_mois || 0,
      icon: <TrendingUp />,
      color: 'linear-gradient(135deg, #ec4899, #db2777)',
      bgColor: 'rgba(236, 72, 153, 0.1)',
      change: '+20%',
      changeColor: 'success',
    },
  ];

  const detailStats = [
    {
      label: 'Patients actifs',
      value: stats?.patients?.actifs || 0,
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      label: 'Rendez-vous confirmés',
      value: stats?.rendezvous?.confirmes || 0,
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      label: 'Rendez-vous en attente',
      value: stats?.rendezvous?.en_attente || 0,
      icon: <Schedule />,
      color: 'warning',
    },
    {
      label: 'Consultations cette semaine',
      value: stats?.consultations?.cette_semaine || 0,
      icon: <CalendarToday />,
      color: 'info',
    },
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Statistiques Globales
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vue d'ensemble de l'activité de la clinique
          </Typography>
        </Box>

        {/* Cartes principales */}
        <Grid container spacing={3}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
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

        {/* Statistiques détaillées */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Détails
          </Typography>
          <Grid container spacing={3}>
            {detailStats.map((detail, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: detail.color + '.light',
                            color: detail.color + '.main',
                          }}
                        >
                          {detail.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {detail.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {detail.label}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Répartition par rôle */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Répartition du Personnel
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <LocalHospital />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats?.utilisateurs?.medecins || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Médecins
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Personnel médical actif
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <BusinessCenter />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats?.utilisateurs?.secretaires || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Secrétaires
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Personnel administratif
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <AdminPanelSettings />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats?.utilisateurs?.admins || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Administrateurs
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Personnel de gestion
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Statistics;
