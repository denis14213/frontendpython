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
  IconButton,
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
  Tooltip,
  Divider,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CalendarToday,
  AccessTime,
  Person,
  LocalHospital,
  Close,
  Search,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const RendezVousManagement = () => {
  const [rendezvous, setRendezVous] = useState([]);
  const [filteredRendezVous, setFilteredRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRdv, setEditingRdv] = useState(null);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    patient_id: '',
    medecin_id: '',
    date_rdv: '',
    heure_rdv: '',
    motif: '',
    notes: '',
  });

  useEffect(() => {
    fetchRendezVous();
    fetchPatients();
    fetchMedecins();
  }, []);

  useEffect(() => {
    filterRendezVous();
  }, [rendezvous, searchTerm]);

  const fetchRendezVous = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/secretaire/rendezvous');
      setRendezVous(response.data.rendezvous || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/secretaire/patients');
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Erreur:', error);
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

  const filterRendezVous = () => {
    let filtered = rendezvous;

    if (searchTerm) {
      filtered = filtered.filter(
        (rdv) =>
          (rdv.patient?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rdv.patient?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rdv.medecin?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rdv.medecin?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rdv.motif?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRendezVous(filtered);
  };

  const handleOpenDialog = (rdv = null) => {
    if (rdv) {
      setEditingRdv(rdv);
      setFormData({
        patient_id: rdv.patient?._id || '',
        medecin_id: rdv.medecin_id || rdv.medecin?.user_id || '',
        date_rdv: rdv.date_rdv ? rdv.date_rdv.split('T')[0] : '',
        heure_rdv: rdv.heure_rdv || '',
        motif: rdv.motif || '',
        notes: rdv.notes || '',
      });
    } else {
      setEditingRdv(null);
      setFormData({
        patient_id: '',
        medecin_id: '',
        date_rdv: '',
        heure_rdv: '',
        motif: '',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRdv(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingRdv) {
        await axios.put(`/secretaire/rendezvous/${editingRdv._id}`, formData);
        toast.success('Rendez-vous modifié avec succès');
      } else {
        await axios.post('/secretaire/rendezvous', formData);
        toast.success('Rendez-vous créé avec succès');
      }
      handleCloseDialog();
      fetchRendezVous();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (rdvId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      try {
        await axios.delete(`/secretaire/rendezvous/${rdvId}`);
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

  const stats = {
    total: rendezvous.length,
    aujourdhui: rendezvous.filter(
      (rdv) => new Date(rdv.date_rdv).toDateString() === new Date().toDateString()
    ).length,
    confirmes: rendezvous.filter((rdv) => rdv.statut === 'confirme').length,
    enAttente: rendezvous.filter((rdv) => rdv.statut === 'demande').length,
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
              Gestion des Rendez-vous
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gérez tous les rendez-vous de la clinique
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #0284c7, #22c55e)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0369a1, #16a34a)',
              },
            }}
          >
            Nouveau Rendez-vous
          </Button>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <CalendarToday />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CalendarToday />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.aujourdhui}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Aujourd'hui
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <LocalHospital />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.confirmes}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Confirmés
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <AccessTime />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.enAttente}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        En attente
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recherche */}
        <Paper sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par patient, médecin ou motif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Table */}
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Heure</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Médecin</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Motif</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRendezVous.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CalendarToday sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      {searchTerm ? 'Aucun rendez-vous trouvé' : 'Aucun rendez-vous'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? 'Essayez avec d\'autres mots-clés'
                        : 'Commencez par créer un nouveau rendez-vous'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRendezVous.map((rdv) => (
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
                      {rdv.patient ? (
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'primary.main',
                            }}
                          >
                            <Person sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {rdv.patient.prenom} {rdv.patient.nom}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {rdv.medecin ? (
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'success.main',
                            }}
                          >
                            <LocalHospital sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Dr. {rdv.medecin.prenom} {rdv.medecin.nom}
                          </Typography>
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
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(rdv)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Annuler">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(rdv._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
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
                <Avatar sx={{ bgcolor: editingRdv ? 'primary.main' : 'success.main' }}>
                  {editingRdv ? <Edit /> : <Add />}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {editingRdv ? 'Modifier Rendez-vous' : 'Nouveau Rendez-vous'}
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
                    Dr. {medecin.prenom} {medecin.nom} - {medecin.specialite}
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
                label="Motif"
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              />
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              {editingRdv ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default RendezVousManagement;
