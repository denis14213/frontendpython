import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Assignment,
  LocalHospital,
  CalendarToday,
  Description,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const MyDossiers = () => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await axios.get('/patient/dossiers');
      setDossiers(response.data.dossiers || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des dossiers');
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

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Mes Dossiers Médicaux
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consultez vos dossiers médicaux et historiques de consultations
          </Typography>
        </Box>

        {/* Dossiers */}
        {dossiers.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Aucun dossier médical disponible
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vos dossiers médicaux apparaîtront ici après vos consultations
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {dossiers.map((dossier, index) => (
              <motion.div
                key={dossier._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Accordion
                  sx={{
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: 2,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: 'grey.50',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Assignment />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Consultation du{' '}
                            {new Date(dossier.date_consultation).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <LocalHospital sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {dossier.medecin
                              ? `Dr. ${dossier.medecin.prenom} ${dossier.medecin.nom}`
                              : 'Médecin non spécifié'}
                          </Typography>
                        </Stack>
                      </Box>
                      {dossier.diagnostic && (
                        <Chip
                          label="Diagnostic"
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={3}>
                      {dossier.diagnostic && (
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <Description sx={{ fontSize: 20, color: 'primary.main' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Diagnostic
                            </Typography>
                          </Stack>
                          <Paper
                            sx={{
                              p: 2,
                              bgcolor: 'primary.50',
                              borderLeft: 3,
                              borderColor: 'primary.main',
                            }}
                          >
                            <Typography variant="body1">{dossier.diagnostic}</Typography>
                          </Paper>
                        </Box>
                      )}

                      {dossier.observations && (
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Observations
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dossier.observations}
                          </Typography>
                        </Box>
                      )}

                      {(dossier.poids || dossier.taille || dossier.tension_arterielle || dossier.temperature) && (
                        <>
                          <Divider />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                              Paramètres vitaux
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                              {dossier.poids && (
                                <Chip
                                  label={`Poids: ${dossier.poids} kg`}
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                              {dossier.taille && (
                                <Chip
                                  label={`Taille: ${dossier.taille} cm`}
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                              {dossier.tension_arterielle && (
                                <Chip
                                  label={`Tension: ${dossier.tension_arterielle}`}
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                              {dossier.temperature && (
                                <Chip
                                  label={`Température: ${dossier.temperature}°C`}
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                            </Stack>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default MyDossiers;
