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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  Avatar,
  Chip,
  Tooltip,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Edit,
  Search,
  AccountCircle,
  Person,
  Email,
  Phone,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const PatientsManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date_naissance: '',
    adresse: '',
    ville: '',
    code_postal: '',
    sexe: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/secretaire/patients');
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des patients');
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          `${patient.prenom} ${patient.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.telephone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPatients(filtered);
  };

  const handleOpenDialog = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        nom: patient.nom || '',
        prenom: patient.prenom || '',
        email: patient.email || '',
        telephone: patient.telephone || '',
        date_naissance: patient.date_naissance ? patient.date_naissance.split('T')[0] : '',
        adresse: patient.adresse || '',
        ville: patient.ville || '',
        code_postal: patient.code_postal || '',
        sexe: patient.sexe || '',
      });
    } else {
      setEditingPatient(null);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        date_naissance: '',
        adresse: '',
        ville: '',
        code_postal: '',
        sexe: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPatient(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingPatient) {
        await axios.put(`/secretaire/patients/${editingPatient._id}`, formData);
        toast.success('Patient modifié avec succès');
      } else {
        await axios.post('/secretaire/patients', formData);
        toast.success('Patient créé avec succès');
      }
      handleCloseDialog();
      fetchPatients();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    }
  };

  const handleCreateAccount = async (patientId) => {
    if (window.confirm('Créer un compte utilisateur pour ce patient ? Les identifiants seront envoyés par email.')) {
      try {
        await axios.post(`/secretaire/patients/${patientId}/compte`);
        toast.success('Compte créé avec succès. Les identifiants ont été envoyés par email.');
        fetchPatients();
      } catch (error) {
        console.error('Erreur:', error);
        toast.error(error.response?.data?.error || 'Erreur lors de la création du compte');
      }
    }
  };

  const stats = {
    total: patients.length,
    avecCompte: patients.filter((p) => p.user_id).length,
    sansCompte: patients.filter((p) => !p.user_id).length,
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
              Gestion des Patients
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gérez les informations des patients
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
            Ajouter Patient
          </Button>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Patients
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircle />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.avecCompte}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avec Compte
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <AccountCircle />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.sansCompte}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sans Compte
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
            placeholder="Rechercher un patient par nom, prénom, email ou téléphone..."
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
                <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Téléphone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Compte</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      {searchTerm ? 'Aucun patient trouvé' : 'Aucun patient'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? 'Essayez avec d\'autres mots-clés'
                        : 'Commencez par ajouter un patient'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow
                    key={patient._id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                          }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {patient.prenom} {patient.nom}
                          </Typography>
                          {patient.date_naissance && (
                            <Typography variant="caption" color="text.secondary">
                              {new Date(patient.date_naissance).toLocaleDateString('fr-FR')}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{patient.email || '-'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{patient.telephone || '-'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {patient.user_id ? (
                        <Chip label="Oui" color="success" size="small" />
                      ) : (
                        <Chip label="Non" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(patient)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        {!patient.user_id && patient.email && (
                          <Tooltip title="Créer un compte">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleCreateAccount(patient._id)}
                            >
                              <AccountCircle />
                            </IconButton>
                          </Tooltip>
                        )}
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
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: editingPatient ? 'primary.main' : 'success.main' }}>
                {editingPatient ? <Edit /> : <Add />}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {editingPatient ? 'Modifier Patient' : 'Nouveau Patient'}
              </Typography>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom *"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom *"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date de naissance"
                  type="date"
                  value={formData.date_naissance}
                  onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sexe"
                  select
                  value={formData.sexe}
                  onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Ville"
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Code postal"
                  value={formData.code_postal}
                  onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                />
              </Grid>
            </Grid>
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
              {editingPatient ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default PatientsManagement;
