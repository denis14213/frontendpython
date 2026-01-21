import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  People,
  CalendarToday,
  PersonAdd,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import PatientsManagement from './PatientsManagement';
import RendezVousManagement from './RendezVousManagement';
import CreatePatientAccount from './CreatePatientAccount';

const SecretaireDashboard = () => {
  const menuItems = [
    { id: 'patients', label: 'Gestion Patients', icon: <People />, path: '/secretaire' },
    { id: 'rendezvous', label: 'Gestion Rendez-vous', icon: <CalendarToday />, path: '/secretaire/rendezvous' },
    { id: 'create-account', label: 'Créer Compte Patient', icon: <PersonAdd />, path: '/secretaire/create-account' },
  ];

  return (
    <Layout menuItems={menuItems} title="Espace Secrétaire">
      <Routes>
        <Route path="/" element={<PatientsManagement />} />
        <Route path="/rendezvous" element={<RendezVousManagement />} />
        <Route path="/create-account" element={<CreatePatientAccount />} />
      </Routes>
    </Layout>
  );
};

export default SecretaireDashboard;
