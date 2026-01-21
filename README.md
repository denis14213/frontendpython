# Frontend - Plateforme de Gestion de Clinique Médicale

## Description

Frontend React avec Material-UI pour la plateforme de gestion de clinique médicale.

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Lancer l'application en mode développement :
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## Structure du Projet

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Composants réutilisables
│   │   └── PrivateRoute.js
│   ├── contexts/           # Contextes React
│   │   └── AuthContext.js
│   ├── pages/              # Pages de l'application
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── admin/          # Pages Admin
│   │   ├── medecin/        # Pages Médecin
│   │   ├── secretaire/     # Pages Secrétaire
│   │   └── patient/        # Pages Patient
│   ├── App.js              # Composant principal
│   └── index.js            # Point d'entrée
└── package.json
```

## Fonctionnalités

### Page d'accueil publique
- Présentation de la clinique
- Services proposés
- Informations de contact
- À propos

### Authentification
- Connexion
- Inscription patient
- Gestion de session

### Module Admin
- Gestion des utilisateurs
- Statistiques globales
- Vue de tous les rendez-vous

### Module Médecin
- Mes rendez-vous
- Mes patients
- Création de dossiers médicaux
- Création d'ordonnances
- Génération PDF ordonnances

### Module Secrétaire
- Gestion des patients
- Création de comptes patients
- Gestion des rendez-vous

### Module Patient
- Tableau de bord
- Prise de rendez-vous en ligne
- Consultation des dossiers médicaux
- Consultation des ordonnances
- Consultation des documents
- Notifications
- Gestion du profil

## Technologies

- React 18
- Material-UI 5
- React Router 6
- Axios
- Date-fns

# frontendpython
