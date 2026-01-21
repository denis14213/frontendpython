import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Draw,
  CloudUpload,
  CheckCircle,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const SignatureSettings = () => {
  const [hasSignature, setHasSignature] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    checkSignature();
  }, []);

  const checkSignature = async () => {
    try {
      const response = await axios.get('/medecin/signature');
      setHasSignature(response.data.has_signature);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        toast.error('Format non supporté. Utilisez PNG ou JPG');
        return;
      }

      // Vérifier la taille (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Fichier trop volumineux (max 2MB)');
        return;
      }

      setSelectedFile(file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('signature', selectedFile);

    try {
      await axios.post('/medecin/signature', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Signature uploadée avec succès');
      setHasSignature(true);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Signature Numérique
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez votre signature numérique pour authentifier vos ordonnances
          </Typography>
        </Box>

        {/* Statut */}
        {hasSignature && (
          <Alert severity="success" icon={<CheckCircle />}>
            Votre signature numérique est configurée et sera automatiquement ajoutée à toutes vos ordonnances
          </Alert>
        )}

        {/* Informations */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <Info />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Pourquoi une signature numérique ?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Garantit l'authenticité de vos ordonnances
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Typography variant="body2">
                ✓ Authentifie automatiquement toutes vos ordonnances
              </Typography>
              <Typography variant="body2">
                ✓ Ajoute le cachet officiel de la clinique
              </Typography>
              <Typography variant="body2">
                ✓ Conforme aux normes de sécurité médicale
              </Typography>
              <Typography variant="body2">
                ✓ Format accepté: PNG, JPG (max 2MB)
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Upload */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <Draw />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {hasSignature ? 'Mettre à jour' : 'Ajouter'} votre signature
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploadez une image de votre signature manuscrite
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={3}>
              {/* Prévisualisation */}
              {previewUrl && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Prévisualisation:
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: 'grey.50',
                      minHeight: 150,
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Signature preview"
                      style={{ maxWidth: '100%', maxHeight: 200 }}
                    />
                  </Paper>
                </Box>
              )}

              {/* Boutons */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  Choisir un fichier
                  <input
                    type="file"
                    hidden
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileSelect}
                  />
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : <CheckCircle />}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                    },
                  }}
                >
                  {uploading ? 'Upload en cours...' : 'Enregistrer la signature'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default SignatureSettings;
