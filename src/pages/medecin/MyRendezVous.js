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
  CircularProgress,
  Chip,
  Stack,
  Avatar,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  LocalHospital,
  Search,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const MyRendezVous = () => {
  const [rendezvous, setRendezVous] = useState([]);
  const [filteredRendezVous, setFilteredRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [refuseDialog, setRefuseDialog] = useState({ open: false, rdvId: null });
  const [motifRefus, setMotifRefus] = useState('');

  useEffect(() => {
    fetchRendezVous();
  }, []);

  useEffect(() => {
    filterRendezVous();
  }, [rendezvous, searchTerm]);

  const fetchRendezVous = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/medecin/rendezvous');
      setRendezVous(response.data.rendezvous || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const handleAccepter = async (rdvId) => {
    try {
      setActionLoading(rdvId);
      await axios.post(`/medecin/rendezvous/${rdvId}/accepter`);
      toast.success('Rendez-vous accepté');
      fetchRendezVous();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'acceptation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefuser = async () => {
    try {
      setActionLoading(refuseDialog.rdvId);
      await axios.post(`/medecin/rendezvous/${refuseDialog.rdvId}/refuser`, {
        motif_refus: motifRefus || 'Indisponibilité du médecin',
      });
      toast.success('Rendez-vous refusé');
      setRefuseDialog({ open: false, rdvId: null });
      setMotifRefus('');
      fetchRendezVous();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors du refus');
    } finally {
      setActionLoading(null);
    }
  };

  const filterRendezVous = () => {
    let filtered = rendezvous;

    if (searchTerm) {
      filtered = filtered.filter(
        (rdv) =>
          (rdv.patient?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rdv.patient?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rdv.motif?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRendezVous(filtered);
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
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Mes Rendez-vous
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez vos rendez-vous avec vos patients
          </Typography>
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
            placeholder="Rechercher par patient ou motif..."
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
                <TableCell sx={{ fontWeight: 'bold' }}>Motif</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRendezVous.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CalendarToday sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      {searchTerm ? 'Aucun résultat trouvé' : 'Aucun rendez-vous'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? 'Essayez avec d\'autres mots-clés'
                        : 'Vous n\'avez pas encore de rendez-vous programmé'}
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
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {rdv.patient.prenom} {rdv.patient.nom}
                            </Typography>
                            {rdv.patient.telephone && (
                              <Typography variant="caption" color="text.secondary">
                                {rdv.patient.telephone}
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
                    <TableCell align="center">
                      {rdv.statut === 'demande' && (
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Accepter">
                            <IconButton
                              color="success"
                              size="small"
                              onClick={() => handleAccepter(rdv._id)}
                              disabled={actionLoading === rdv._id}
                            >
                              {actionLoading === rdv._id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <CheckCircle />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Refuser">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => setRefuseDialog({ open: true, rdvId: rdv._id })}
                              disabled={actionLoading === rdv._id}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {/* Dialog de refus */}
      <Dialog open={refuseDialog.open} onClose={() => setRefuseDialog({ open: false, rdvId: null })}>
        <DialogTitle>Refuser le rendez-vous</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Indiquez le motif du refus (optionnel):
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Ex: Indisponibilité, urgence, etc."
            value={motifRefus}
            onChange={(e) => setMotifRefus(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefuseDialog({ open: false, rdvId: null })}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRefuser}
            disabled={actionLoading !== null}
          >
            Refuser le rendez-vous
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyRendezVous;
