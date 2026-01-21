import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Dashboard,
  CalendarToday,
  People,
  Assignment,
  Description,
  CloudUpload,
  Draw,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import MyRendezVous from './MyRendezVous';
import MyPatients from './MyPatients';
import CreateDossier from './CreateDossier';
import CreateOrdonnance from './CreateOrdonnance';
import UploadDocument from './UploadDocument';
import SignatureSettings from './SignatureSettings';

const MedecinDashboard = () => {
  const menuItems = [
    { id: 'rendezvous', label: 'Mes Rendez-vous', icon: <CalendarToday />, path: '/medecin' },
    { id: 'patients', label: 'Mes Patients', icon: <People />, path: '/medecin/patients' },
    { id: 'dossier', label: 'Créer Dossier', icon: <Assignment />, path: '/medecin/dossier' },
    { id: 'ordonnance', label: 'Créer Ordonnance', icon: <Description />, path: '/medecin/ordonnance' },
    { id: 'upload', label: 'Upload Document', icon: <CloudUpload />, path: '/medecin/upload' },
    { id: 'signature', label: 'Ma Signature', icon: <Draw />, path: '/medecin/signature' },
  ];

  return (
    <Layout menuItems={menuItems} title="Espace Médecin">
      <Routes>
        <Route path="/" element={<MyRendezVous />} />
        <Route path="/patients" element={<MyPatients />} />
        <Route path="/dossier" element={<CreateDossier />} />
        <Route path="/ordonnance" element={<CreateOrdonnance />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/signature" element={<SignatureSettings />} />
      </Routes>
    </Layout>
  );
};

export default MedecinDashboard;
