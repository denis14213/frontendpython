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
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Stack,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  InputAdornment,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Search,
  LockReset,
  Person,
  Email,
  Phone,
  LocalHospital,
  AdminPanelSettings,
  BusinessCenter,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'medecin',
    nom: '',
    prenom: '',
    telephone: '',
    specialite: '',
    numero_ordre: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        role: user.role,
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: user.telephone || '',
        specialite: user.specialite || '',
        numero_ordre: user.numero_ordre || '',
        password: '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        role: 'medecin',
        nom: '',
        prenom: '',
        telephone: '',
        specialite: '',
        numero_ordre: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setShowPassword(false);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.email) {
        toast.error('L\'email est obligatoire');
        return;
      }

      if (editingUser) {
        await axios.put(`/admin/users/${editingUser._id}`, formData);
        toast.success('Utilisateur modifié avec succès');
      } else {
        if (!formData.password && !editingUser) {
          // Le backend générera un mot de passe automatiquement
        }
        await axios.post('/admin/users', formData);
        toast.success('Utilisateur créé avec succès');
      }
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
      try {
        await axios.delete(`/admin/users/${userId}`);
        toast.success('Utilisateur désactivé avec succès');
        fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la désactivation:', error);
        toast.error(error.response?.data?.error || 'Erreur lors de la désactivation');
      }
    }
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm('Réinitialiser le mot de passe de cet utilisateur ? Un nouveau mot de passe sera envoyé par email.')) {
      try {
        await axios.post(`/admin/users/${userId}/reset-password`);
        toast.success('Le nouveau mot de passe a été envoyé par email');
      } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        toast.error(error.response?.data?.error || 'Erreur lors de la réinitialisation');
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings />;
      case 'medecin':
        return <LocalHospital />;
      case 'secretaire':
        return <BusinessCenter />;
      default:
        return <Person />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'medecin':
        return 'primary';
      case 'secretaire':
        return 'success';
      default:
        return 'default';
    }
  };

  const stats = {
    total: users.length,
    medecins: users.filter((u) => u.role === 'medecin').length,
    secretaires: users.filter((u) => u.role === 'secretaire').length,
    admins: users.filter((u) => u.role === 'admin').length,
    actifs: users.filter((u) => u.is_active).length,
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
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Gestion des Utilisateurs
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchUsers}
            >
              Actualiser
            </Button>
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
              Ajouter Utilisateur
            </Button>
          </Stack>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2.4}>
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
                        Total
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <LocalHospital />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.medecins}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Médecins
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <BusinessCenter />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.secretaires}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Secrétaires
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <AdminPanelSettings />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.admins}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Admins
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.actifs}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Actifs
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Filtres */}
        <Paper sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom, prénom ou email..."
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
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filtrer par rôle</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Filtrer par rôle"
              >
                <MenuItem value="all">Tous les rôles</MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="medecin">Médecin</MenuItem>
                <MenuItem value="secretaire">Secrétaire</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Rôle</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Téléphone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun utilisateur trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: getRoleColor(user.role) + '.main',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getRoleIcon(user.role)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.prenom} {user.nom}
                          </Typography>
                          {user.specialite && (
                            <Typography variant="caption" color="text.secondary">
                              {user.specialite}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{user.email}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {user.telephone ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{user.telephone}</Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? 'Actif' : 'Inactif'}
                        color={user.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Réinitialiser mot de passe">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleResetPassword(user._id)}
                          >
                            <LockReset />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Désactiver">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(user._id)}
                            disabled={user.role === 'admin' && users.filter((u) => u.role === 'admin').length === 1}
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

        {/* Dialog pour créer/modifier */}
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
              <Avatar
                sx={{
                  bgcolor: editingUser ? 'primary.main' : 'success.main',
                }}
              >
                {editingUser ? <Edit /> : <Add />}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {editingUser ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
              </Typography>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prénom *"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom *"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>

              <TextField
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={!!editingUser}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                helperText={editingUser ? "L'email ne peut pas être modifié" : ''}
              />

              {!editingUser && (
                <TextField
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  fullWidth
                  helperText="Laissé vide pour génération automatique"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockReset />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <TextField
                label="Téléphone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Rôle *"
                select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                fullWidth
              >
                <MenuItem value="medecin">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalHospital sx={{ fontSize: 20 }} />
                    <span>Médecin</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="secretaire">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BusinessCenter sx={{ fontSize: 20 }} />
                    <span>Secrétaire</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="admin">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AdminPanelSettings sx={{ fontSize: 20 }} />
                    <span>Administrateur</span>
                  </Stack>
                </MenuItem>
              </TextField>

              {formData.role === 'medecin' && (
                <>
                  <TextField
                    label="Spécialité"
                    value={formData.specialite}
                    onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                    fullWidth
                    placeholder="Ex: Cardiologie, Pédiatrie..."
                  />
                  <TextField
                    label="Numéro d'ordre"
                    value={formData.numero_ordre}
                    onChange={(e) => setFormData({ ...formData, numero_ordre: e.target.value })}
                    fullWidth
                    placeholder="Numéro RPPS ou ADELI"
                  />
                </>
              )}
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
              {editingUser ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default UsersManagement;
