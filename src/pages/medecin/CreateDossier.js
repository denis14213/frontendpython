import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Assignment,
  Person,
  CalendarToday,
  Scale,
  Height,
  Favorite,
  Thermostat,
  Description,
  Save,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreateDossier = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    date_consultation: new Date().toISOString().split('T')[0],
    observations: '',
    diagnostic: '',
    examen_clinique: '',
    poids: '',
    taille: '',
    tension_arterielle: '',
    temperature: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/medecin/patients');
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des patients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post('/medecin/dossiers', formData);
      setSuccess(true);
      toast.success('Dossier médical créé avec succès');
      setFormData({
        patient_id: '',
        date_consultation: new Date().toISOString().split('T')[0],
        observations: '',
        diagnostic: '',
        examen_clinique: '',
        poids: '',
        taille: '',
        tension_arterielle: '',
        temperature: '',
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Créer un Dossier Médical
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enregistrez les informations de consultation d'un patient
          </Typography>
        </Box>

        {/* Formulaire */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                <Assignment />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Nouveau Dossier Médical
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Remplissez les informations de la consultation
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Dossier médical créé avec succès !
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Informations de base */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Informations de base
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Patient *"
                        value={formData.patient_id}
                        onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {patients.map((patient) => (
                          <MenuItem key={patient._id} value={patient._id}>
                            {patient.prenom} {patient.nom}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date de consultation *"
                        type="date"
                        value={formData.date_consultation}
                        onChange={(e) =>
                          setFormData({ ...formData, date_consultation: e.target.value })
                        }
                        InputLabelProps={{ shrink: true }}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Paramètres vitaux */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Paramètres vitaux
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Poids (kg)"
                        type="number"
                        value={formData.poids}
                        onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Scale />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Taille (cm)"
                        type="number"
                        value={formData.taille}
                        onChange={(e) => setFormData({ ...formData, taille: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Height />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Tension artérielle"
                        value={formData.tension_arterielle}
                        onChange={(e) =>
                          setFormData({ ...formData, tension_arterielle: e.target.value })
                        }
                        placeholder="Ex: 120/80"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Favorite />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Température (°C)"
                        type="number"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Thermostat />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Examen et diagnostic */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Examen et diagnostic
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Examen clinique"
                        multiline
                        rows={4}
                        value={formData.examen_clinique}
                        onChange={(e) =>
                          setFormData({ ...formData, examen_clinique: e.target.value })
                        }
                        placeholder="Décrivez l'examen clinique effectué..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                              <Description />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Diagnostic"
                        multiline
                        rows={3}
                        value={formData.diagnostic}
                        onChange={(e) => setFormData({ ...formData, diagnostic: e.target.value })}
                        placeholder="Indiquez le diagnostic..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                              <Assignment />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Observations"
                        multiline
                        rows={4}
                        value={formData.observations}
                        onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                        placeholder="Ajoutez vos observations et notes..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                              <Description />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                    },
                  }}
                >
                  {loading ? 'Création en cours...' : 'Créer le Dossier Médical'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default CreateDossier;
