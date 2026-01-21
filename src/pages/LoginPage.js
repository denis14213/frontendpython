import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Favorite as Heart,
  ArrowBack,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Phone,
} from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // États pour la connexion
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // États pour l'inscription
  const [signupNom, setSignupNom] = useState('');
  const [signupPrenom, setSignupPrenom] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupTelephone, setSignupTelephone] = useState('');

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
        // Afficher l'erreur retournée par le backend
        toast.error(result.error || 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur de connexion');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupNom || !signupPrenom || !signupEmail || !signupPassword || !signupTelephone) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await fetch('/api/public/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: signupNom,
          prenom: signupPrenom,
          email: signupEmail,
          password: signupPassword,
          telephone: signupTelephone,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Compte créé avec succès. Vos identifiants ont été envoyés par email.');
        setTimeout(() => {
          navigate('/patient');
        }, 1500);
      } else {
        toast.error(data.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      toast.error('Erreur lors de la création du compte');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0284c7, #22c55e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '450px' }}
      >
        {/* Bouton retour */}
        <Button
          variant="text"
          sx={{
            mb: 2,
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
          }}
          onClick={() => navigate('/')}
          startIcon={<ArrowBack />}
        >
          Retour à l'accueil
        </Button>

        <Card sx={{ p: 4, boxShadow: 8 }}>
          {/* Logo et titre */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Heart sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Clinique Santé Plus
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Accédez à votre espace personnel
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Connexion" />
            <Tab label="Inscription" />
          </Tabs>

          {/* Formulaire de connexion */}
          {tabValue === 0 && (
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
                        <Email />
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
          {tabValue === 1 && (
            <form onSubmit={handleSignup}>
              <Stack spacing={3}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Nom"
                    placeholder="Dupont"
                    value={signupNom}
                    onChange={(e) => setSignupNom(e.target.value)}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Prénom"
                    placeholder="Jean"
                    value={signupPrenom}
                    onChange={(e) => setSignupPrenom(e.target.value)}
                    required
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="votre@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Téléphone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={signupTelephone}
                  onChange={(e) => setSignupTelephone(e.target.value)}
                  required
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
                  label="Mot de passe"
                  type={showSignupPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
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
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          edge="end"
                        >
                          {showSignupPassword ? <VisibilityOff /> : <Visibility />}
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
                  Créer mon compte patient
                </Button>

                <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  Vos identifiants vous seront envoyés par email
                </Typography>
              </Stack>
            </form>
          )}
        </Card>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
