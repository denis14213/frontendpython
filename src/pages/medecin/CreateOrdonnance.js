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
  IconButton,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Description,
  Person,
  CalendarToday,
  Medication,
  Add,
  Delete,
  Save,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreateOrdonnance = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    date_ordonnance: new Date().toISOString().split('T')[0],
    traitements: [{ medicament: '', posologie: '', duree: '' }],
    instructions: '',
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

  const handleTraitementChange = (index, field, value) => {
    const newTraitements = [...formData.traitements];
    newTraitements[index][field] = value;
    setFormData({ ...formData, traitements: newTraitements });
  };

  const addTraitement = () => {
    setFormData({
      ...formData,
      traitements: [...formData.traitements, { medicament: '', posologie: '', duree: '' }],
    });
  };

  const removeTraitement = (index) => {
    if (formData.traitements.length > 1) {
      const newTraitements = formData.traitements.filter((_, i) => i !== index);
      setFormData({ ...formData, traitements: newTraitements });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post('/medecin/ordonnances', formData);
      setSuccess(true);
      toast.success('Ordonnance créée avec succès');
      setFormData({
        patient_id: '',
        date_ordonnance: new Date().toISOString().split('T')[0],
        traitements: [{ medicament: '', posologie: '', duree: '' }],
        instructions: '',
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
            Créer une Ordonnance
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Prescrivez des traitements médicaux à un patient
          </Typography>
        </Box>

        {/* Formulaire */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64 }}>
                <Description />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Nouvelle Ordonnance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Remplissez les informations de prescription
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Ordonnance créée avec succès !
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
                        label="Date de l'ordonnance *"
                        type="date"
                        value={formData.date_ordonnance}
                        onChange={(e) => setFormData({ ...formData, date_ordonnance: e.target.value })}
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

                {/* Traitements */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Traitements
                    </Typography>
                    <Chip
                      label={`${formData.traitements.length} traitement(s)`}
                      color="primary"
                      size="small"
                    />
                  </Stack>
                  <Stack spacing={2}>
                    {formData.traitements.map((traitement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            bgcolor: 'grey.50',
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="flex-start" mb={2}>
                            <Medication sx={{ color: 'primary.main', mt: 0.5 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Traitement {index + 1}
                            </Typography>
                            {formData.traitements.length > 1 && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeTraitement(index)}
                                sx={{ ml: 'auto' }}
                              >
                                <Delete />
                              </IconButton>
                            )}
                          </Stack>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Médicament"
                                value={traitement.medicament}
                                onChange={(e) =>
                                  handleTraitementChange(index, 'medicament', e.target.value)
                                }
                                placeholder="Nom du médicament"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Posologie"
                                value={traitement.posologie}
                                onChange={(e) =>
                                  handleTraitementChange(index, 'posologie', e.target.value)
                                }
                                placeholder="Ex: 1 comprimé matin et soir"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Durée"
                                value={traitement.duree}
                                onChange={(e) =>
                                  handleTraitementChange(index, 'duree', e.target.value)
                                }
                                placeholder="Ex: 7 jours"
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      </motion.div>
                    ))}
                  </Stack>
                  <Button
                    startIcon={<Add />}
                    onClick={addTraitement}
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    Ajouter un traitement
                  </Button>
                </Box>

                <Divider />

                {/* Instructions */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Instructions particulières
                  </Typography>
                  <TextField
                    fullWidth
                    label="Instructions particulières"
                    multiline
                    rows={4}
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="Ajoutez des instructions particulières pour le patient..."
                  />
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
                  {loading ? 'Création en cours...' : 'Créer l\'Ordonnance'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default CreateOrdonnance;
