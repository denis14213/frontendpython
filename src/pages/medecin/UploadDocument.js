import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  CloudUpload,
  Person,
  Assignment,
  Description,
  CalendarToday,
  Save,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const UploadDocument = () => {
  const [patients, setPatients] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    dossier_id: '',
    type_document: 'autre',
    description: '',
    date_examen: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (formData.patient_id) {
      fetchDossiers();
    }
  }, [formData.patient_id]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/medecin/patients');
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des patients');
    }
  };

  const fetchDossiers = async () => {
    try {
      const response = await axios.get(`/medecin/patients/${formData.patient_id}/dossiers`);
      setDossiers(response.data.dossiers || []);
    } catch (error) {
      console.error('Erreur:', error);
      setDossiers([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 10 MB)');
        return;
      }
      // Vérifier le type
      const allowedTypes = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(extension)) {
        toast.error('Type de fichier non autorisé');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    if (!formData.patient_id) {
      toast.error('Veuillez sélectionner un patient');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      uploadData.append('patient_id', formData.patient_id);
      if (formData.dossier_id) {
        uploadData.append('dossier_id', formData.dossier_id);
      }
      uploadData.append('type_document', formData.type_document);
      uploadData.append('description', formData.description || '');
      uploadData.append('date_examen', formData.date_examen);

      const response = await axios.post('/medecin/documents', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      toast.success('Document uploadé avec succès');
      setFormData({
        patient_id: '',
        dossier_id: '',
        type_document: 'autre',
        description: '',
        date_examen: new Date().toISOString().split('T')[0],
      });
      setSelectedFile(null);
      // Réinitialiser l'input file
      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'upload du document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Uploader un Document Médical
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ajoutez un document médical (radiographie, analyse, etc.) pour un patient
          </Typography>
        </Box>

        {/* Formulaire */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                <CloudUpload />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Nouveau Document Médical
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Formats acceptés: PDF, PNG, JPG, DOC, DOCX (max 10 MB)
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Document uploadé avec succès ! Le patient recevra une notification.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Sélection du patient */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Informations du patient
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Patient *"
                        value={formData.patient_id}
                        onChange={(e) => setFormData({ ...formData, patient_id: e.target.value, dossier_id: '' })}
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Dossier médical (optionnel)"
                        value={formData.dossier_id}
                        onChange={(e) => setFormData({ ...formData, dossier_id: e.target.value })}
                        disabled={!formData.patient_id || dossiers.length === 0}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Assignment />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="">Aucun dossier</MenuItem>
                        {dossiers.map((dossier) => (
                          <MenuItem key={dossier._id} value={dossier._id}>
                            {new Date(dossier.date_consultation).toLocaleDateString('fr-FR')} - {dossier.diagnostic || 'Sans diagnostic'}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Informations du document */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Informations du document
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Type de document *"
                        value={formData.type_document}
                        onChange={(e) => setFormData({ ...formData, type_document: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Description />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="radiographie">Radiographie</MenuItem>
                        <MenuItem value="analyse">Analyse</MenuItem>
                        <MenuItem value="echographie">Échographie</MenuItem>
                        <MenuItem value="scanner">Scanner</MenuItem>
                        <MenuItem value="irm">IRM</MenuItem>
                        <MenuItem value="autre">Autre</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date d'examen"
                        type="date"
                        value={formData.date_examen}
                        onChange={(e) => setFormData({ ...formData, date_examen: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description (optionnel)"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Ajoutez une description du document..."
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Upload du fichier */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Fichier à uploader
                  </Typography>
                  <Box
                    sx={{
                      border: 2,
                      borderColor: selectedFile ? 'primary.main' : 'grey.300',
                      borderStyle: 'dashed',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      bgcolor: selectedFile ? 'primary.50' : 'grey.50',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50',
                      },
                    }}
                  >
                    <input
                      accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
                      style={{ display: 'none' }}
                      id="file-input"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-input">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUpload />}
                        sx={{
                          mb: 2,
                          background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                          },
                        }}
                      >
                        Sélectionner un fichier
                      </Button>
                    </label>
                    {selectedFile ? (
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Aucun fichier sélectionné
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Divider />

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !selectedFile || !formData.patient_id}
                  fullWidth
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  sx={{
                    background: 'linear-gradient(135deg, #0284c7, #22c55e)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0369a1, #16a34a)',
                    },
                  }}
                >
                  {loading ? 'Upload en cours...' : 'Uploader le Document'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default UploadDocument;

