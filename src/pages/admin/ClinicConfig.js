import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Settings,
  Business,
  Phone,
  Email,
  Home,
  AccessTime,
  Add,
  Delete,
  Save,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const ClinicConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    adresse: '',
    telephone: '',
    email: '',
    horaires: {
      lundi: '',
      mardi: '',
      mercredi: '',
      jeudi: '',
      vendredi: '',
      samedi: '',
      dimanche: '',
    },
    services: [],
  });
  const [newService, setNewService] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/clinique');
      const config = response.data.config || {};
      setFormData({
        nom: config.nom || '',
        description: config.description || '',
        adresse: config.adresse || '',
        telephone: config.telephone || '',
        email: config.email || '',
        horaires: config.horaires || {
          lundi: '',
          mardi: '',
          mercredi: '',
          jeudi: '',
          vendredi: '',
          samedi: '',
          dimanche: '',
        },
        services: config.services || [],
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de la configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await axios.put('/admin/clinique', formData);
      setSuccess(true);
      toast.success('Configuration mise à jour avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, newService.trim()],
      });
      setNewService('');
    }
  };

  const handleRemoveService = (service) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const jours = [
    { key: 'lundi', label: 'Lundi' },
    { key: 'mardi', label: 'Mardi' },
    { key: 'mercredi', label: 'Mercredi' },
    { key: 'jeudi', label: 'Jeudi' },
    { key: 'vendredi', label: 'Vendredi' },
    { key: 'samedi', label: 'Samedi' },
    { key: 'dimanche', label: 'Dimanche' },
  ];

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Configuration de la Clinique
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les informations publiques de la clinique
          </Typography>
        </Box>

        {/* Formulaire */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                <Settings />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Informations de la Clinique
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ces informations seront visibles sur la page d'accueil publique
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Configuration mise à jour avec succès !
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Informations de base */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Informations générales
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nom de la clinique *"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Business />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description de la clinique..."
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Adresse"
                        value={formData.adresse}
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Home />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Horaires */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Horaires d'ouverture
                  </Typography>
                  <Grid container spacing={2}>
                    {jours.map((jour) => (
                      <Grid item xs={12} sm={6} key={jour.key}>
                        <TextField
                          fullWidth
                          label={jour.label}
                          value={formData.horaires[jour.key] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              horaires: {
                                ...formData.horaires,
                                [jour.key]: e.target.value,
                              },
                            })
                          }
                          placeholder="Ex: 08:00 - 18:00 ou Fermé"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccessTime />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Divider />

                {/* Services */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Services proposés
                  </Typography>
                  <Stack direction="row" spacing={2} mb={2}>
                    <TextField
                      fullWidth
                      label="Ajouter un service"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddService();
                        }
                      }}
                      placeholder="Ex: Consultation générale"
                    />
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAddService}
                      disabled={!newService.trim()}
                    >
                      Ajouter
                    </Button>
                  </Stack>
                  {formData.services.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.services.map((service) => (
                        <Chip
                          key={service}
                          label={service}
                          onDelete={() => handleRemoveService(service)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </Box>

                <Divider />

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  fullWidth
                  size="large"
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                    },
                  }}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer la Configuration'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default ClinicConfig;

