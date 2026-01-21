# 📱 EXEMPLES RESPONSIVE - GUIDE PRATIQUE

## 🎯 Exemples Concrets d'Utilisation

Ce guide contient des exemples pratiques pour rendre vos pages responsive.

## 1. Dashboard avec Statistiques

### Code
```javascript
import React from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';
import { People, CalendarToday, Description, CheckCircle } from '@mui/icons-material';

const Dashboard = () => {
  const stats = [
    { title: 'Patients', value: '150', icon: <People />, color: '#0284c7' },
    { title: 'RDV Aujourd\'hui', value: '12', icon: <CalendarToday />, color: '#22c55e' },
    { title: 'Dossiers', value: '89', icon: <Description />, color: '#f59e0b' },
    { title: 'Complétés', value: '45', icon: <CheckCircle />, color: '#8b5cf6' },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                      fontWeight: 'bold',
                      color: stat.color
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ color: stat.color, fontSize: { xs: 32, sm: 40 } }}>
                  {stat.icon}
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
```

### Résultat
- **Mobile:** 1 carte par ligne (pleine largeur)
- **Tablette:** 2 cartes par ligne
- **Desktop:** 4 cartes par ligne

## 2. Formulaire de Création

### Code
```javascript
import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Stack, Typography } from '@mui/material';

const CreateForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        Créer un Patient
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Section: Informations personnelles */}
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            color: 'primary.main',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          Informations personnelles
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Téléphone"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            />
          </Grid>
        </Grid>

        {/* Section: Adresse */}
        <Typography 
          variant="h6" 
          sx={{ 
            mt: { xs: 3, sm: 4 },
            mb: 2, 
            color: 'primary.main',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          Adresse
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresse"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Ville"
              value={formData.ville}
              onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Code Postal"
              value={formData.codePostal}
              onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
            />
          </Grid>
        </Grid>

        {/* Boutons d'action */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 2, sm: 3 }}
          sx={{ mt: { xs: 3, sm: 4 } }}
        >
          <Button 
            variant="outlined" 
            fullWidth={{ xs: true, sm: false }}
            sx={{ minWidth: { sm: 120 } }}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            fullWidth={{ xs: true, sm: false }}
            sx={{ minWidth: { sm: 120 } }}
          >
            Enregistrer
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreateForm;
```

### Résultat
- **Mobile:** Champs empilés verticalement, boutons pleine largeur
- **Tablette/Desktop:** Champs côte à côte, boutons normaux

## 3. Liste/Table Responsive

### Code
```javascript
import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

const PatientsList = () => {
  const patients = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@email.com', telephone: '0612345678', statut: 'Actif' },
    { id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie@email.com', telephone: '0623456789', statut: 'Actif' },
    { id: 3, nom: 'Bernard', prenom: 'Pierre', email: 'pierre@email.com', telephone: '0634567890', statut: 'Inactif' },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        Liste des Patients
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          overflowX: 'auto',
          boxShadow: 2,
        }}
      >
        <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Nom
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Prénom
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'table-cell' }
                }}
              >
                Email
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  display: { xs: 'none', md: 'table-cell' }
                }}
              >
                Téléphone
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'table-cell' }
                }}
              >
                Statut
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} hover>
                <TableCell>{patient.nom}</TableCell>
                <TableCell>{patient.prenom}</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {patient.email}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  {patient.telephone}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Chip 
                    label={patient.statut} 
                    color={patient.statut === 'Actif' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" color="primary">
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientsList;
```

### Résultat
- **Mobile:** Colonnes essentielles uniquement (Nom, Prénom, Actions), scroll horizontal
- **Tablette:** + Email et Statut
- **Desktop:** Toutes les colonnes visibles

## 4. Dialog/Modal Responsive

### Code
```javascript
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const ResponsiveDialog = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Ouvrir Dialog
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile} // Plein écran sur mobile
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: '90vh' },
            borderRadius: { xs: 0, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ 
          p: { xs: 2, sm: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Titre du Dialog
          </Box>
          <IconButton onClick={() => setOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Champ 1" />
            <TextField fullWidth label="Champ 2" />
            <TextField fullWidth label="Champ 3" multiline rows={4} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
        }}>
          <Button 
            onClick={() => setOpen(false)}
            fullWidth={{ xs: true, sm: false }}
          >
            Annuler
          </Button>
          <Button 
            variant="contained"
            fullWidth={{ xs: true, sm: false }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResponsiveDialog;
```

### Résultat
- **Mobile:** Dialog plein écran, boutons empilés
- **Desktop:** Dialog centré, boutons côte à côte

## 5. Navigation Responsive

### Code
```javascript
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  People,
  CalendarToday,
  Description,
} from '@mui/icons-material';

const ResponsiveNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Accueil', icon: <Home /> },
    { text: 'Patients', icon: <People /> },
    { text: 'Rendez-vous', icon: <CalendarToday /> },
    { text: 'Dossiers', icon: <Description /> },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Clinique Santé Plus
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          {drawer}
        </Drawer>
      )}

      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer variant="permanent">
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default ResponsiveNav;
```

### Résultat
- **Mobile:** Menu burger, drawer temporaire
- **Desktop:** Menu permanent sur le côté

## 6. Cards Grid Responsive

### Code
```javascript
import React from 'react';
import { Box, Grid, Card, CardContent, CardActions, Button, Typography } from '@mui/material';

const CardsGrid = () => {
  const items = [
    { id: 1, title: 'Item 1', description: 'Description 1' },
    { id: 2, title: 'Item 2', description: 'Description 2' },
    { id: 3, title: 'Item 3', description: 'Description 3' },
    { id: 4, title: 'Item 4', description: 'Description 4' },
    { id: 5, title: 'Item 5', description: 'Description 5' },
    { id: 6, title: 'Item 6', description: 'Description 6' },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Voir</Button>
                <Button size="small">Modifier</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardsGrid;
```

### Résultat
- **Mobile:** 1 carte par ligne
- **Tablette:** 2 cartes par ligne
- **Desktop:** 3 cartes par ligne
- **Large Desktop:** 4 cartes par ligne

## 🎯 Conseils Pratiques

### 1. Toujours Tester sur Mobile
- Utilisez Chrome DevTools (F12 → Mode mobile)
- Testez sur un vrai téléphone si possible

### 2. Padding Responsive
```javascript
// ❌ Mauvais
<Box sx={{ padding: '32px' }}>

// ✅ Bon
<Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
```

### 3. Grid Responsive
```javascript
// ❌ Mauvais
<Grid item xs={3}>

// ✅ Bon
<Grid item xs={12} sm={6} md={4} lg={3}>
```

### 4. Typography Responsive
```javascript
// ❌ Mauvais
<Typography variant="h1">

// ✅ Bon
<Typography 
  variant="h1" 
  sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
>
```

### 5. Boutons Responsive
```javascript
// ❌ Mauvais
<Button>Action</Button>

// ✅ Bon
<Button fullWidth={{ xs: true, sm: false }}>
  Action
</Button>
```

---

**Utilisez ces exemples comme base pour vos pages!** 🚀
