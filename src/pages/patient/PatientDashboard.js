import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Dashboard,
  CalendarToday,
  Assignment,
  Description,
  Folder,
  Notifications,
  Person,
} from '@mui/icons-material';
import { Badge } from '@mui/material';
import axios from 'axios';
import Layout from '../../components/Layout';
import DashboardView from './DashboardView';
import MyRendezVous from './MyRendezVous';
import MyDossiers from './MyDossiers';
import MyOrdonnances from './MyOrdonnances';
import MyDocuments from './MyDocuments';
import MyNotifications from './MyNotifications';
import MyProfil from './MyProfil';

const PatientDashboard = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 30000); // Rafraîchir toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get('/patient/notifications?is_read=false');
      setUnreadNotifications(response.data.notifications?.length || 0);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <Dashboard />, path: '/patient' },
    { id: 'rendezvous', label: 'Mes Rendez-vous', icon: <CalendarToday />, path: '/patient/rendezvous' },
    { id: 'dossiers', label: 'Mes Dossiers', icon: <Assignment />, path: '/patient/dossiers' },
    { id: 'ordonnances', label: 'Mes Ordonnances', icon: <Description />, path: '/patient/ordonnances' },
    { id: 'documents', label: 'Mes Documents', icon: <Folder />, path: '/patient/documents' },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <Badge badgeContent={unreadNotifications} color="error">
          <Notifications />
        </Badge>
      ),
      path: '/patient/notifications',
    },
    { id: 'profil', label: 'Mon Profil', icon: <Person />, path: '/patient/profil' },
  ];

  return (
    <Layout menuItems={menuItems} title="Espace Patient">
      <Routes>
        <Route
          path="/"
          element={<DashboardView onNotificationClick={() => window.location.href = '/patient/notifications'} />}
        />
        <Route path="/rendezvous" element={<MyRendezVous />} />
        <Route path="/dossiers" element={<MyDossiers />} />
        <Route path="/ordonnances" element={<MyOrdonnances />} />
        <Route path="/documents" element={<MyDocuments />} />
        <Route path="/notifications" element={<MyNotifications onUpdate={fetchUnreadNotifications} />} />
        <Route path="/profil" element={<MyProfil />} />
      </Routes>
    </Layout>
  );
};

export default PatientDashboard;
