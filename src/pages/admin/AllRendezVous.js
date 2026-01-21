import React, { useState, useEffect } from 'react';
import {
  Box,
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
} from '@mui/material';
import axios from 'axios';

const AllRendezVous = () => {
  const [rendezvous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRendezVous();
  }, []);

  const fetchRendezVous = async () => {
    try {
      const response = await axios.get('/admin/rendezvous');
      setRendezVous(response.data.rendezvous);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      setLoading(false);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tous les Rendez-vous
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Heure</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Médecin</TableCell>
              <TableCell>Motif</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rendezvous.map((rdv) => (
              <TableRow key={rdv._id}>
                <TableCell>{new Date(rdv.date_rdv).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{rdv.heure_rdv}</TableCell>
                <TableCell>
                  {rdv.patient ? `${rdv.patient.prenom} ${rdv.patient.nom}` : 'N/A'}
                </TableCell>
                <TableCell>
                  {rdv.medecin ? `${rdv.medecin.prenom} ${rdv.medecin.nom}` : 'N/A'}
                </TableCell>
                <TableCell>{rdv.motif || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={rdv.statut}
                    color={getStatusColor(rdv.statut)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllRendezVous;

