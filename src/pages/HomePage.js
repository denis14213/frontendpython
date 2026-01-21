import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
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
  Tabs,
  Tab,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Favorite as Heart,
  MedicalServices as Stethoscope,
  CalendarToday as Calendar,
  People,
  Phone,
  Email as Mail,
  LocationOn as MapPin,
  AccessTime as Clock,
  CheckCircle,
  LocalHospital,
  Close,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  Home,
  CalendarToday,
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, logout, register } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // États pour la connexion
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // États pour l'inscription
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ouvrir le dialog d'authentification si on vient de /login ou /register
  useEffect(() => {
    if (location.pathname === '/login') {
      setAuthDialogOpen(true);
      setAuthTab(0);
      navigate('/', { replace: true });
    } else if (location.pathname === '/register') {
      setAuthDialogOpen(true);
      setAuthTab(1);
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Déconnexion réussie');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const result = await login(loginEmail, loginPassword);
      if (result.success) {
        toast.success(`Bienvenue ${result.user.prenom} !`);
        setAuthDialogOpen(false);
        const role = result.user.role;
        setTimeout(() => {
          switch (role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'medecin':
              navigate('/medecin');
              break;
            case 'secretaire':
              navigate('/secretaire');
              break;
            case 'patient':
              navigate('/patient');
              break;
            default:
              navigate('/');
          }
        }, 1000);
      } else {
        toast.error(result.error || 'Erreur de connexion');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupData.nom || !signupData.prenom || !signupData.email || !signupData.password || !signupData.telephone) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const result = await register(signupData);
      if (result.success) {
        toast.success('Compte créé avec succès. Vos identifiants ont été envoyés par email.');
        setAuthDialogOpen(false);
        setTimeout(() => {
          navigate('/patient');
        }, 1500);
      } else {
        toast.error(result.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      toast.error('Erreur lors de la création du compte');
    }
  };

  const services = [
    {
      icon: <Stethoscope sx={{ fontSize: 32 }} />,
      title: 'Consultation Générale',
      description: 'Consultation avec nos médecins généralistes expérimentés',
    },
    {
      icon: <Heart sx={{ fontSize: 32 }} />,
      title: 'Cardiologie',
      description: 'Spécialistes en santé cardiovasculaire et prévention',
    },
    {
      icon: <People sx={{ fontSize: 32 }} />,
      title: 'Pédiatrie',
      description: 'Soins dédiés à la santé de vos enfants',
    },
    {
      icon: <Calendar sx={{ fontSize: 32 }} />,
      title: 'Rendez-vous en Ligne',
      description: 'Prenez rendez-vous facilement depuis chez vous',
    },
  ];

  const avantages = [
    'Personnel médical qualifié et expérimenté',
    'Équipements médicaux modernes',
    'Prise de rendez-vous en ligne 24/7',
    'Dossier médical numérique sécurisé',
    'Suivi personnalisé de votre santé',
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header / Navigation */}
      <AppBar
        position="sticky"
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: scrolled ? 'background.paper' : 'transparent',
          borderBottom: scrolled ? 1 : 0,
          borderColor: 'divider',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <Container maxWidth="lg" sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Heart sx={{ fontSize: 32, color: 'primary.main' }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                    }}
                  >
                    Clinique Santé Plus
                  </Typography>
                </Stack>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Stack direction="row" spacing={2}>
                  {user ? (
                    <>
                      <Typography
                        variant="body2"
                        sx={{ alignSelf: 'center', color: 'text.primary', mr: 1 }}
                      >
                        {user.prenom} {user.nom}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={handleLogout}
                        size="small"
                      >
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setAuthTab(0);
                          setAuthDialogOpen(true);
                        }}
                        size="small"
                      >
                        Connexion
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setAuthTab(1);
                          setAuthDialogOpen(true);
                        }}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                          },
                        }}
                      >
                        Créer un compte
                      </Button>
                    </>
                  )}
                </Stack>
              </motion.div>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0284c7, #22c55e)',
          color: 'white',
          py: { xs: 10, md: 15 },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Votre Santé, Notre Priorité
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Des soins médicaux de qualité avec une équipe dévouée à votre bien-être.
                Prenez rendez-vous en ligne en quelques clics.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                flexWrap="wrap"
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                  startIcon={<Calendar />}
                  onClick={() => navigate('/book-appointment')}
                >
                  Prendre Rendez-vous
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                  startIcon={<Phone />}
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Nous Contacter
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                Nos Services
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                }}
              >
                Une gamme complète de services médicaux pour toute la famille
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Avantages Section */}
      <Box sx={{ py: { xs: 10, md: 15 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 4,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  Pourquoi Nous Choisir ?
                </Typography>
                <Stack spacing={2}>
                  {avantages.map((avantage, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <CheckCircle
                          sx={{
                            color: 'primary.main',
                            fontSize: 24,
                            mt: 0.5,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '1.125rem',
                          }}
                        >
                          {avantage}
                        </Typography>
                      </Stack>
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card
                  id="contact"
                  sx={{
                    p: 4,
                    boxShadow: 6,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 4,
                    }}
                  >
                    Informations Pratiques
                  </Typography>
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Clock sx={{ color: 'primary.main', mt: 0.5, fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Horaires
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Lun - Ven: 8h - 19h
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Sam: 9h - 17h
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Phone sx={{ color: 'primary.main', mt: 0.5, fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Téléphone
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          +33 1 23 45 67 89
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Mail sx={{ color: 'primary.main', mt: 0.5, fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Email
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          contact@cliniquesanteplus.fr
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <MapPin sx={{ color: 'primary.main', mt: 0.5, fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Adresse
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          123 Avenue de la Santé, 75000 Paris
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                Prêt à Prendre Soin de Votre Santé ?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                Créez votre compte patient et accédez à tous nos services en ligne
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                  startIcon={<Calendar />}
                  onClick={() => navigate('/book-appointment')}
                >
                  Prendre Rendez-vous
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                  onClick={() => {
                    setAuthTab(1);
                    setAuthDialogOpen(true);
                  }}
                >
                  Créer Mon Compte
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              © 2024 Clinique Santé Plus. Tous droits réservés.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Dialog d'Authentification */}
      <Dialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        maxWidth={authTab === 1 ? 'md' : 'sm'}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: authTab === 1 ? '90vh' : 'auto',
          },
        }}
      >
        <Box sx={{ position: 'relative', p: { xs: 2, sm: 3 } }}>
          <IconButton
            onClick={() => setAuthDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>

          {/* Logo et titre */}
          <Box sx={{ textAlign: 'center', mb: 3, mt: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Heart sx={{ fontSize: { xs: 40, sm: 48 }, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Clinique Santé Plus
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Accédez à votre espace personnel
            </Typography>
          </Box>

          <Tabs
            value={authTab}
            onChange={(e, newValue) => setAuthTab(newValue)}
            sx={{ 
              mb: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Connexion" sx={{ fontWeight: authTab === 0 ? 600 : 400 }} />
            <Tab label="Inscription" sx={{ fontWeight: authTab === 1 ? 600 : 400 }} />
          </Tabs>

          {/* Formulaire de connexion */}
          {authTab === 0 && (
            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="votre@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
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
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                    },
                  }}
                >
                  Se connecter
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ color: 'primary.main' }}
                  >
                    Mot de passe oublié ?
                  </Button>
                </Box>
              </Stack>
            </form>
          )}

          {/* Formulaire d'inscription */}
          {authTab === 1 && (
            <Box 
              sx={{ 
                maxHeight: { xs: '60vh', sm: '65vh', md: '70vh' }, 
                overflowY: 'auto', 
                pr: { xs: 0, sm: 1 },
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(0,0,0,0.3)',
                  },
                },
              }}
            >
              <form onSubmit={handleSignup}>
                <Stack spacing={3}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'text.secondary', 
                      mb: 1,
                      textAlign: 'center',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    Remplissez le formulaire ci-dessous pour créer votre compte patient
                  </Typography>
                  {/* Section: Informations personnelles */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      Informations personnelles
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Nom *"
                        placeholder="Dupont"
                        value={signupData.nom}
                        onChange={(e) => setSignupData({ ...signupData, nom: e.target.value })}
                        required
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ fontSize: 20 }} />
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
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Section: Contact */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      Informations de contact
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Email *"
                        type="email"
                        placeholder="votre@email.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail sx={{ fontSize: 20 }} />
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
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone sx={{ fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Date de naissance et Sexe */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Date de naissance"
                      type="date"
                      value={signupData.date_naissance}
                      onChange={(e) => setSignupData({ ...signupData, date_naissance: e.target.value })}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      select
                      label="Sexe"
                      value={signupData.sexe}
                      onChange={(e) => setSignupData({ ...signupData, sexe: e.target.value })}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="">Sélectionner</MenuItem>
                      <MenuItem value="M">Masculin</MenuItem>
                      <MenuItem value="F">Féminin</MenuItem>
                    </TextField>
                  </Box>

                  {/* Section: Adresse */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      Adresse (optionnel)
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Adresse"
                        placeholder="123 Rue de la Santé"
                        value={signupData.adresse}
                        onChange={(e) => setSignupData({ ...signupData, adresse: e.target.value })}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Home sx={{ fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Ville"
                          placeholder="Paris"
                          value={signupData.ville}
                          onChange={(e) => setSignupData({ ...signupData, ville: e.target.value })}
                          size="small"
                        />
                        <TextField
                          fullWidth
                          label="Code postal"
                          placeholder="75000"
                          value={signupData.code_postal}
                          onChange={(e) => setSignupData({ ...signupData, code_postal: e.target.value })}
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </Box>

                  {/* Numéro de sécurité sociale */}
                  <TextField
                    fullWidth
                    label="Numéro de sécurité sociale"
                    placeholder="1 23 45 67 89 012 34"
                    value={signupData.numero_securite_sociale}
                    onChange={(e) => setSignupData({ ...signupData, numero_securite_sociale: e.target.value })}
                    helperText="Optionnel - Format: 1 23 45 67 89 012 34"
                    size="small"
                  />

                  {/* Section: Sécurité */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      Sécurité
                    </Typography>
                    <TextField
                      fullWidth
                      label="Mot de passe *"
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      size="small"
                      helperText="Minimum 8 caractères recommandé"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                              edge="end"
                              size="small"
                            >
                              {showSignupPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Créer mon compte patient
                  </Button>

                  <Typography 
                    variant="caption" 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'text.secondary',
                      display: 'block',
                      mt: 1,
                      fontSize: '0.75rem',
                    }}
                  >
                    * Champs obligatoires. Vos identifiants vous seront envoyés par email.
                  </Typography>
                </Stack>
              </form>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default HomePage;
