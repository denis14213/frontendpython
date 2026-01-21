import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Stack,
  Paper,
  AppBar,
  Toolbar,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as Clock,
  Person as User,
  CheckCircle,
  ArrowBack,
  MedicalServices as Stethoscope,
  LocalHospital,
  Lock,
  Visibility,
  VisibilityOff,
  Email as Mail,
  Phone,
  Home,
  CalendarToday,
  Person as PersonIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user, register, checkAuth } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [medecins, setMedecins] = useState([]);
  const [creneauxDisponibles, setCreneauxDisponibles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // États du formulaire de rendez-vous
  const [selectedMedecin, setSelectedMedecin] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [motif, setMotif] = useState('');

  // États du formulaire d'inscription
  const [signupData, setSignupData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    date_naissance: '',
    adresse: '',
    ville: '',
    code_postal: '',
    sexe: '',
    numero_securite_sociale: '',
  });

  useEffect(() => {
    fetchMedecins();
  }, []);

  useEffect(() => {
    if (selectedMedecin && selectedDate) {
      fetchDisponibilite();
    } else {
      setCreneauxDisponibles([]);
    }
  }, [selectedMedecin, selectedDate]);

  // Vérifier si l'utilisateur est connecté après l'inscription
  useEffect(() => {
    if (user && showSignupDialog) {
      // L'utilisateur vient de s'inscrire, créer le rendez-vous
      handleConfirmAppointmentAfterSignup();
    }
  }, [user, showSignupDialog]);

  const fetchMedecins = async () => {
    try {
      const response = await axios.get('/public/medecins');
      setMedecins(response.data.medecins || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des médecins:', error);
      toast.error('Erreur lors du chargement des médecins');
    }
  };

  const fetchDisponibilite = async () => {
    if (!selectedMedecin || !selectedDate) {
      setCreneauxDisponibles([]);
      return;
    }

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(
        `/public/medecins/${selectedMedecin}/disponibilite?date=${dateStr}`
      );
      setCreneauxDisponibles(response.data.creneaux_disponibles || []);
    } catch (error) {
      console.error('Erreur lors de la récupération de la disponibilité:', error);
      const defaultHoraires = [];
      for (let h = 8; h < 18; h++) {
        for (let m = 0; m < 60; m += 30) {
          defaultHoraires.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
      }
      setCreneauxDisponibles(defaultHoraires);
    }
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    if (date.getDay() === 0) return true; // Dimanche
    return false;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedMedecin) {
      toast.error('Veuillez sélectionner un médecin');
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmAppointment = async () => {
    if (!selectedMedecin || !selectedDate || !selectedTime) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    // Si l'utilisateur n'est pas connecté, ouvrir le dialog d'inscription
    if (!user) {
      setShowSignupDialog(true);
      return;
    }

    // Créer le rendez-vous directement
    await createRendezVous();
  };

  const createRendezVous = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await axios.post('/patient/rendezvous', {
        medecin_id: selectedMedecin,
        date_rdv: dateStr,
        heure_rdv: selectedTime,
        motif: motif || 'Consultation',
      });

      if (response.data) {
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          toast.success('Rendez-vous confirmé ! Vous recevrez un email de confirmation.');
          navigate('/patient');
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la création du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointmentAfterSignup = async () => {
    setShowSignupDialog(false);
    await createRendezVous();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupData.nom || !signupData.prenom || !signupData.email || !signupData.password) {
      toast.error('Veuillez remplir les champs obligatoires (nom, prénom, email, mot de passe)');
      return;
    }

    setLoading(true);
    try {
      const result = await register(signupData);
      if (result.success) {
        toast.success('Compte créé avec succès !');
        // checkAuth sera appelé automatiquement et déclenchera handleConfirmAppointmentAfterSignup
        await checkAuth();
      } else {
        toast.error(result.error || 'Erreur lors de la création du compte');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Erreur lors de la création du compte');
      setLoading(false);
    }
  };

  const getMedecinInfo = () => {
    return medecins.find((m) => m._id === selectedMedecin || m.user_id === selectedMedecin);
  };

  const horairesDisponibles = creneauxDisponibles.length > 0 
    ? creneauxDisponibles 
    : ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

  const steps = ['Médecin', 'Date & Heure', 'Confirmation'];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{ color: 'white' }}
              >
                Retour
              </Button>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                Prendre Rendez-vous
              </Typography>
              {user && (
                <Chip
                  label={`${user.prenom} ${user.nom}`}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                />
              )}
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Message si non connecté */}
        {!user && (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              bgcolor: 'info.light',
              color: 'info.contrastText',
              textAlign: 'center',
            }}
          >
            <Typography variant="body1">
              <strong>Note :</strong> Vous devrez créer un compte pour confirmer votre rendez-vous.
              Vous pouvez remplir le formulaire ci-dessous, puis créer votre compte à la fin.
            </Typography>
          </Paper>
        )}

        {/* Indicateur de progression */}
        <Box sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
          <Stepper activeStep={currentStep - 1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Contenu principal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ p: { xs: 3, md: 6 }, boxShadow: 6 }}>
              {/* Étape 1: Sélection du médecin */}
              {currentStep === 1 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Choisissez votre médecin
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                    Sélectionnez le médecin avec qui vous souhaitez prendre rendez-vous
                  </Typography>

                  {medecins.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Chargement des médecins...
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {medecins.map((medecin) => (
                        <Grid item xs={12} sm={6} md={4} key={medecin._id || medecin.user_id}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              sx={{
                                p: 3,
                                cursor: 'pointer',
                                border: 2,
                                borderColor:
                                  selectedMedecin === (medecin._id || medecin.user_id)
                                    ? 'primary.main'
                                    : 'divider',
                                bgcolor:
                                  selectedMedecin === (medecin._id || medecin.user_id)
                                    ? 'primary.50'
                                    : 'background.paper',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  boxShadow: 4,
                                },
                              }}
                              onClick={() => setSelectedMedecin(medecin._id || medecin.user_id)}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                  sx={{
                                    bgcolor: 'primary.main',
                                    width: 56,
                                    height: 56,
                                  }}
                                >
                                  <LocalHospital />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Dr. {medecin.prenom} {medecin.nom}
                                  </Typography>
                                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                    <Stethoscope sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {medecin.specialite || 'Médecine générale'}
                                    </Typography>
                                  </Stack>
                                </Box>
                                {selectedMedecin === (medecin._id || medecin.user_id) && (
                                  <CheckCircle sx={{ color: 'primary.main' }} />
                                )}
                              </Stack>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {/* Étape 2: Sélection date et heure */}
              {currentStep === 2 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Choisissez la date et l'heure
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                    Consultation avec {getMedecinInfo()?.prenom} {getMedecinInfo()?.nom}
                  </Typography>

                  <Grid container spacing={4}>
                    {/* Date */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Date du rendez-vous
                      </Typography>
                      <TextField
                        fullWidth
                        type="date"
                        label="Sélectionnez une date"
                        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          if (!isDateDisabled(date)) {
                            setSelectedDate(date);
                            setSelectedTime('');
                          } else {
                            toast.error('Cette date n\'est pas disponible');
                          }
                        }}
                        inputProps={{
                          min: new Date().toISOString().split('T')[0],
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        helperText="Les dimanches ne sont pas disponibles"
                      />
                    </Grid>

                    {/* Horaires */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Heure du rendez-vous
                      </Typography>
                      {selectedDate ? (
                        <Box
                          sx={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 1.5,
                          }}
                        >
                          {horairesDisponibles.map((heure) => (
                            <Button
                              key={heure}
                              variant={selectedTime === heure ? 'contained' : 'outlined'}
                              startIcon={<Clock />}
                              onClick={() => setSelectedTime(heure)}
                              sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                              }}
                            >
                              {heure}
                            </Button>
                          ))}
                        </Box>
                      ) : (
                        <Paper
                          sx={{
                            p: 6,
                            textAlign: 'center',
                            border: '2px dashed',
                            borderColor: 'divider',
                          }}
                        >
                          <CalendarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Sélectionnez d'abord une date
                          </Typography>
                        </Paper>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Étape 3: Confirmation */}
              {currentStep === 3 && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Confirmez votre rendez-vous
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                    Vérifiez les informations avant de confirmer
                  </Typography>

                  {/* Récapitulatif */}
                  <Card sx={{ p: 4, bgcolor: 'grey.50', mb: 4 }}>
                    <Stack spacing={3}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <User sx={{ color: 'primary.main', mt: 0.5, fontSize: 24 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Médecin
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Dr. {getMedecinInfo()?.prenom} {getMedecinInfo()?.nom}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {getMedecinInfo()?.specialite || 'Médecine générale'}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider />

                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <CalendarIcon sx={{ color: 'primary.main', mt: 0.5, fontSize: 24 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Date
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {selectedDate && format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider />

                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Clock sx={{ color: 'primary.main', mt: 0.5, fontSize: 24 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Heure
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {selectedTime}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card>

                  {/* Motif de consultation */}
                  <TextField
                    fullWidth
                    label="Motif de consultation (optionnel)"
                    multiline
                    rows={4}
                    placeholder="Décrivez brièvement le motif de votre consultation..."
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    sx={{ mb: 3 }}
                  />

                  {/* Informations importantes */}
                  <Paper sx={{ p: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      <strong>Important :</strong> Vous recevrez un email de confirmation avec tous
                      les détails de votre rendez-vous. En cas d'empêchement, merci d'annuler au
                      moins 24h à l'avance.
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* Boutons de navigation */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 6 }}
              >
                {currentStep > 1 && (
                  <Button
                    variant="outlined"
                    onClick={handlePreviousStep}
                    fullWidth
                    size="large"
                  >
                    Précédent
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    variant="contained"
                    onClick={handleNextStep}
                    fullWidth
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                      },
                    }}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleConfirmAppointment}
                    disabled={loading}
                    fullWidth
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                    sx={{
                      background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                      },
                    }}
                  >
                    {loading ? 'Confirmation...' : user ? 'Confirmer le rendez-vous' : 'Créer un compte et confirmer'}
                  </Button>
                )}
              </Stack>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* Dialog d'inscription */}
      <Dialog
        open={showSignupDialog}
        onClose={() => setShowSignupDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          Créer un compte pour confirmer votre rendez-vous
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSignup}>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Nom *"
                  placeholder="Dupont"
                  value={signupData.nom}
                  onChange={(e) => setSignupData({ ...signupData, nom: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Prénom *"
                  placeholder="Jean"
                  value={signupData.prenom}
                  onChange={(e) => setSignupData({ ...signupData, prenom: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Email *"
                type="email"
                placeholder="votre@email.com"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Téléphone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={signupData.telephone}
                onChange={(e) => setSignupData({ ...signupData, telephone: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Mot de passe *"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                  },
                  mt: 1,
                }}
              >
                {loading ? 'Création...' : 'Créer mon compte et confirmer le rendez-vous'}
              </Button>

              <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                * Champs obligatoires. Vos identifiants vous seront envoyés par email.
              </Typography>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'success.light',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <CheckCircle sx={{ fontSize: 32, color: 'success.main' }} />
          </Box>
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            Rendez-vous confirmé !
          </DialogTitle>
          <DialogContentText sx={{ textAlign: 'center' }}>
            Votre rendez-vous a été enregistré avec succès. Un email de confirmation vous sera
            envoyé dans quelques instants.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BookAppointment;
