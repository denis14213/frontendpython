import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Delete,
  CalendarToday,
  AccessTime,
  Person,
  LocalHospital,
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const MyRendezVous = () => {
  const navigate = useNavigate();
  const [rendezvous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [medecins, setMedecins] = useState([]);
  const [formData, setFormData] = useState({
    medecin_id: '',
    date_rdv: '',
    heure_rdv: '',
    motif: '',
  });

  useEffect(() => {
    fetchRendezVous();
    fetchMedecins();
  }, []);

  const fetchRendezVous = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/patient/rendezvous');
      setRendezVous(response.data.rendezvous || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedecins = async () => {
    try {
      const response = await axios.get('/public/medecins');
      setMedecins(response.data.medecins || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      medecin_id: '',
      date_rdv: '',
      heure_rdv: '',
      motif: '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.medecin_id || !formData.date_rdv || !formData.heure_rdv) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
      await axios.post('/patient/rendezvous', formData);
      toast.success('Demande de rendez-vous envoyée avec succès');
      handleCloseDialog();
      fetchRendezVous();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  const handleCancel = async (rdvId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      try {
        await axios.delete(`/patient/rendezvous/${rdvId}`);
        toast.success('Rendez-vous annulé avec succès');
        fetchRendezVous();
      } catch (error) {
        console.error('Erreur:', error);
        toast.error(error.response?.data?.error || 'Erreur lors de l\'annulation');
      }
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'confirme':
        return 'success';
      case 'demande':
        return 'warning';
      case 'annule':
        return 'error';
      case 'termine':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (statut) => {
    const labels = {
      confirme: 'Confirmé',
      demande: 'En attente',
      annule: 'Annulé',
      termine: 'Terminé',
    };
    return labels[statut] || statut;
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Mes Rendez-vous
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gérez vos rendez-vous médicaux
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/book-appointment')}
            >
              Prendre un rendez-vous
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenDialog}
              sx={{
                background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                },
              }}
            >
              Demander un RDV
            </Button>
          </Stack>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Heure</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Médecin</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Motif</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rendezvous.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CalendarToday sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      Aucun rendez-vous
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Vous n'avez pas encore de rendez-vous programmé
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/book-appointment')}
                      sx={{
                        background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                        },
                      }}
                    >
                      Prendre un rendez-vous
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                rendezvous.map((rdv) => (
                  <TableRow
                    key={rdv._id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {new Date(rdv.date_rdv).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">{rdv.heure_rdv}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {rdv.medecin ? (
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'primary.main',
                            }}
                          >
                            <LocalHospital sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              Dr. {rdv.medecin.prenom} {rdv.medecin.nom}
                            </Typography>
                            {rdv.medecin.specialite && (
                              <Typography variant="caption" color="text.secondary">
                                {rdv.medecin.specialite}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{rdv.motif || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(rdv.statut)}
                        color={getStatusColor(rdv.statut)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {rdv.statut !== 'annule' && rdv.statut !== 'termine' && (
                        <Tooltip title="Annuler le rendez-vous">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancel(rdv._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Add />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Demander un Rendez-vous
                </Typography>
              </Stack>
              <IconButton onClick={handleCloseDialog} size="small">
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                select
                label="Médecin *"
                value={formData.medecin_id}
                onChange={(e) => setFormData({ ...formData, medecin_id: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalHospital />
                    </InputAdornment>
                  ),
                }}
              >
                {medecins.map((medecin) => (
                  <MenuItem key={medecin._id || medecin.user_id} value={medecin.user_id || medecin._id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person />
                      <Box>
                        <Typography variant="body1">
                          Dr. {medecin.prenom} {medecin.nom}
                        </Typography>
                        {medecin.specialite && (
                          <Typography variant="caption" color="text.secondary">
                            {medecin.specialite}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date *"
                    type="date"
                    value={formData.date_rdv}
                    onChange={(e) => setFormData({ ...formData, date_rdv: e.target.value })}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Heure *"
                    type="time"
                    value={formData.heure_rdv}
                    onChange={(e) => setFormData({ ...formData, heure_rdv: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Motif de consultation"
                multiline
                rows={3}
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                placeholder="Décrivez brièvement le motif de votre consultation..."
              />
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                },
              }}
            >
              Demander
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default MyRendezVous;
