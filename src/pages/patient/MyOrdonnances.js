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
  Button,
  Stack,
  Avatar,
  Chip,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download,
  Description,
  LocalHospital,
  CalendarToday,
  Medication,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const MyOrdonnances = () => {
  const [ordonnances, setOrdonnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchOrdonnances();
  }, []);

  const fetchOrdonnances = async () => {
    try {
      const response = await axios.get('/patient/ordonnances');
      setOrdonnances(response.data.ordonnances || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des ordonnances');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (ordonnanceId) => {
    try {
      setDownloading(ordonnanceId);
      const response = await axios.get(`/patient/ordonnances/${ordonnanceId}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ordonnance_${ordonnanceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement du PDF');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Mes Ordonnances
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consultez et téléchargez vos ordonnances médicales
          </Typography>
        </Box>

        {/* Ordonnances */}
        {ordonnances.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Aucune ordonnance disponible
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vos ordonnances apparaîtront ici après vos consultations
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {ordonnances.map((ord, index) => (
              <motion.div
                key={ord._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                          <Description />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {new Date(ord.date_ordonnance).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                            <LocalHospital sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {ord.medecin
                                ? `Dr. ${ord.medecin.prenom} ${ord.medecin.nom}`
                                : 'Médecin non spécifié'}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Medication sx={{ fontSize: 16, color: 'primary.main' }} />
                            <Chip
                              label={`${ord.traitements?.length || 0} traitement(s) prescrit(s)`}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          </Stack>
                          {ord.instructions && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Instructions particulières :
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {ord.instructions}
                              </Typography>
                            </Box>
                          )}
                          {ord.traitements && ord.traitements.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Traitements :
                              </Typography>
                              <Stack spacing={1}>
                                {ord.traitements.map((traitement, idx) => (
                                  <Paper
                                    key={idx}
                                    sx={{
                                      p: 1.5,
                                      bgcolor: 'grey.50',
                                      borderLeft: 3,
                                      borderColor: 'primary.main',
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {traitement.medicament}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {traitement.posologie} - Durée: {traitement.duree}
                                    </Typography>
                                  </Paper>
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Box>
                      </Stack>
                      <Tooltip title="Télécharger le PDF">
                        <IconButton
                          color="primary"
                          onClick={() => handleDownloadPDF(ord._id)}
                          disabled={downloading === ord._id}
                          sx={{
                            bgcolor: 'primary.50',
                            '&:hover': {
                              bgcolor: 'primary.100',
                            },
                          }}
                        >
                          {downloading === ord._id ? (
                            <CircularProgress size={24} />
                          ) : (
                            <Download />
                          )}
                        </IconButton>
                      </Tooltip>
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

export default MyOrdonnances;
