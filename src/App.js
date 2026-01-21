import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Pages publiques
import HomePage from './pages/HomePage';
import BookAppointment from './pages/BookAppointment';

// Pages protégées
import AdminDashboard from './pages/admin/AdminDashboard';
import MedecinDashboard from './pages/medecin/MedecinDashboard';
import SecretaireDashboard from './pages/secretaire/SecretaireDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';

// Composants
import PrivateRoute from './components/PrivateRoute';

// Thème Material-UI personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#0284c7',
      light: '#0ea5e9',
      dark: '#0369a1',
    },
    secondary: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<HomePage />} />
            <Route path="/register" element={<HomePage />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            
            {/* Routes protégées */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/medecin/*"
              element={
                <PrivateRoute allowedRoles={['medecin']}>
                  <MedecinDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/secretaire/*"
              element={
                <PrivateRoute allowedRoles={['secretaire', 'admin']}>
                  <SecretaireDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/*"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </PrivateRoute>
              }
            />
            
            {/* Route par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

