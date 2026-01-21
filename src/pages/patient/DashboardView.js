import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import {
  CalendarToday,
  Description,
  Folder,
  Notifications,
  ArrowForward,
  Person,
  LocalHospital,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const DashboardView = ({ onNotificationClick }) => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('/patient/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
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
      title: 'Rendez-vous à venir',
      value: dashboard?.prochains_rendezvous?.length || 0,
      icon: <CalendarToday />,
      color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      action: () => navigate('/patient/rendezvous'),
    },
    {
      title: 'Dossiers médicaux',
      value: dashboard?.dossiers?.length || 0,
      icon: <Description />,
      color: 'linear-gradient(135deg, #22c55e, #16a34a)',
      action: () => navigate('/patient/dossiers'),
    },
    {
      title: 'Ordonnances',
      value: dashboard?.ordonnances?.length || 0,
      icon: <Folder />,
      color: 'linear-gradient(135deg, #a855f7, #9333ea)',
      action: () => navigate('/patient/ordonnances'),
    },
    {
      title: 'Notifications',
      value: dashboard?.notifications_non_lues || 0,
      icon: <Notifications />,
      color: 'linear-gradient(135deg, #f97316, #ea580c)',
      action: () => navigate('/patient/notifications'),
      badge: true,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Tableau de bord
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vue d'ensemble de votre espace patient
          </Typography>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={3}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={stat.action}
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
                      {stat.badge && stat.value > 0 && (
                        <Chip
                          label={stat.value}
                          color="error"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
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

        {/* Contenu principal */}
        <Grid container spacing={3}>
          {/* Prochains Rendez-vous */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <CalendarToday />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Prochains Rendez-vous
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Vos prochaines consultations
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/patient/rendezvous')}
                    >
                      Voir tout
                    </Button>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  {dashboard?.prochains_rendezvous?.length > 0 ? (
                    <List>
                      {dashboard.prochains_rendezvous.slice(0, 3).map((rdv, index) => (
                        <React.Fragment key={rdv._id}>
                          <ListItem
                            sx={{
                              px: 0,
                              py: 1.5,
                              '&:hover': {
                                bgcolor: 'action.hover',
                                borderRadius: 1,
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {new Date(rdv.date_rdv).toLocaleDateString('fr-FR', {
                                      weekday: 'long',
                                      day: 'numeric',
                                      month: 'long',
                                    })}
                                  </Typography>
                                  <Chip
                                    label={rdv.heure_rdv}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                </Stack>
                              }
                              secondary={
                                <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {rdv.medecin
                                      ? `Dr. ${rdv.medecin.prenom} ${rdv.medecin.nom}`
                                      : 'Médecin non spécifié'}
                                  </Typography>
                                  {rdv.motif && (
                                    <Typography variant="caption" color="text.secondary">
                                      {rdv.motif}
                                    </Typography>
                                  )}
                                </Stack>
                              }
                            />
                          </ListItem>
                          {index < dashboard.prochains_rendezvous.slice(0, 3).length - 1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Aucun rendez-vous à venir
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/book-appointment')}
                      >
                        Prendre un rendez-vous
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Dernières Ordonnances */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Description />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Dernières Ordonnances
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Vos ordonnances récentes
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/patient/ordonnances')}
                    >
                      Voir tout
                    </Button>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  {dashboard?.dernieres_ordonnances?.length > 0 ? (
                    <List>
                      {dashboard.dernieres_ordonnances.slice(0, 3).map((ord, index) => (
                        <React.Fragment key={ord._id}>
                          <ListItem
                            sx={{
                              px: 0,
                              py: 1.5,
                              '&:hover': {
                                bgcolor: 'action.hover',
                                borderRadius: 1,
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {new Date(ord.date_ordonnance).toLocaleDateString('fr-FR')}
                                  </Typography>
                                  <Chip
                                    label={`${ord.traitements?.length || 0} traitement(s)`}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                  />
                                </Stack>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {ord.medecin
                                    ? `Dr. ${ord.medecin.prenom} ${ord.medecin.nom}`
                                    : 'Médecin non spécifié'}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < dashboard.dernieres_ordonnances.slice(0, 3).length - 1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Aucune ordonnance disponible
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Derniers Documents */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <Folder />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Derniers Documents
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Vos documents médicaux
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/patient/documents')}
                    >
                      Voir tout
                    </Button>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  {dashboard?.derniers_documents?.length > 0 ? (
                    <List>
                      {dashboard.derniers_documents.slice(0, 3).map((doc, index) => (
                        <React.Fragment key={doc._id}>
                          <ListItem
                            sx={{
                              px: 0,
                              py: 1.5,
                              '&:hover': {
                                bgcolor: 'action.hover',
                                borderRadius: 1,
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {doc.nom_fichier}
                                  </Typography>
                                  <Chip
                                    label={doc.type_document}
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                </Stack>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {new Date(doc.date_examen).toLocaleDateString('fr-FR')}
                                  {doc.description && ` - ${doc.description}`}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < dashboard.derniers_documents.slice(0, 3).length - 1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Folder sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Aucun document disponible
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Notifications />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Notifications
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Vos notifications récentes
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/patient/notifications')}
                    >
                      Voir tout
                    </Button>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: 'primary.main',
                      }}
                    >
                      {dashboard?.notifications_non_lues || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      notification{dashboard?.notifications_non_lues !== 1 ? 's' : ''} non
                      lue{dashboard?.notifications_non_lues !== 1 ? 's' : ''}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/patient/notifications')}
                      sx={{
                        background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                        },
                      }}
                    >
                      Voir toutes les notifications
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default DashboardView;
