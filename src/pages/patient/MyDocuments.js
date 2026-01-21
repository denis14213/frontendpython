import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Folder,
  Description,
  CalendarToday,
  InsertDriveFile,
  Download,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/patient/documents');
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, filename) => {
    try {
      const response = await axios.get(`/patient/documents/${documentId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Document téléchargé avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du téléchargement du document');
    }
  };

  const getDocumentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'analyse':
      case 'examen':
        return <Description />;
      default:
        return <InsertDriveFile />;
    }
  };

  const getDocumentColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'analyse':
        return 'primary';
      case 'examen':
        return 'success';
      case 'radiologie':
        return 'warning';
      default:
        return 'default';
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
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Mes Documents Médicaux
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consultez vos documents médicaux et résultats d'examens
          </Typography>
        </Box>

        {/* Documents */}
        {documents.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Folder sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Aucun document disponible
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vos documents médicaux apparaîtront ici
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {documents.map((doc, index) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: getDocumentColor(doc.type_document) + '.main',
                          width: 56,
                          height: 56,
                        }}
                      >
                        {getDocumentIcon(doc.type_document)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1} flexWrap="wrap">
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {doc.nom_fichier}
                          </Typography>
                          <Chip
                            label={doc.type_document}
                            color={getDocumentColor(doc.type_document)}
                            size="small"
                          />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(doc.date_examen).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </Typography>
                          </Stack>
                          {doc.description && (
                            <>
                              <Divider orientation="vertical" flexItem />
                              <Typography variant="body2" color="text.secondary">
                                {doc.description}
                              </Typography>
                            </>
                          )}
                        </Stack>
                      </Box>
                      <Tooltip title="Télécharger">
                        <IconButton
                          color="primary"
                          onClick={() => handleDownload(doc._id, doc.nom_fichier)}
                          sx={{
                            bgcolor: 'primary.50',
                            '&:hover': {
                              bgcolor: 'primary.100',
                            },
                          }}
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default MyDocuments;
