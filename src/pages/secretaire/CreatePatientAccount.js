import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  PersonAdd,
  Person,
  Email,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreatePatientAccount = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/secretaire/patients');
      // Filtrer les patients sans compte
      const patientsWithoutAccount = (response.data.patients || []).filter(
        (p) => !p.user_id && p.email
      );
      setPatients(patientsWithoutAccount);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des patients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError('Veuillez sélectionner un patient');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post(`/secretaire/patients/${selectedPatient}/compte`);
      setSuccess(true);
      setSelectedPatient('');
      toast.success('Compte créé avec succès. Les identifiants ont été envoyés par email.');
      fetchPatients();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.response?.data?.error || 'Erreur lors de la création du compte');
      toast.error(error.response?.data?.error || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Créer un Compte Patient
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Créez un compte utilisateur pour un patient existant
          </Typography>
        </Box>

        {/* Carte principale */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                <PersonAdd />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Nouveau Compte Patient
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Les identifiants seront envoyés par email au patient
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Compte créé avec succès !
                    </Typography>
                    <Typography variant="caption">
                      Les identifiants ont été envoyés par email au patient.
                    </Typography>
                  </Box>
                </Stack>
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                select
                label="Sélectionner un patient (avec email) *"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1 }}>
                      <Person />
                    </Box>
                  ),
                }}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient._id} value={patient._id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person />
                      <Box>
                        <Typography variant="body1">
                          {patient.prenom} {patient.nom}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>

              {patients.length === 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Aucun patient sans compte trouvé. Tous les patients avec un email ont déjà un
                    compte.
                  </Typography>
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={loading || patients.length === 0}
                fullWidth
                size="large"
                startIcon={
                  loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />
                }
                sx={{
                  background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                  },
                }}
              >
                {loading ? 'Création en cours...' : 'Créer le Compte'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default CreatePatientAccount;
