# 🚀 Frontend - Configuration de Déploiement

## ✅ Prêt pour la Production

Le frontend est maintenant configuré pour être déployé en production.

---

## 📦 Fichiers de Configuration

### Variables d'Environnement
- `.env.development` - Configuration locale (http://localhost:5000)
- `.env.production` - Configuration production (à mettre à jour)
- `.env.example` - Exemple de configuration

### Fichiers de Déploiement
- `netlify.toml` - Configuration Netlify (recommandé)
- `vercel.json` - Configuration Vercel
- `render.yaml` - Configuration Render

---

## 🎯 Déploiement Rapide

### Option 1: Netlify (Recommandé)

1. **Créer un compte sur [netlify.com](https://netlify.com)**

2. **Importer le projet**
   - "Add new site" → "Import an existing project"
   - Connecter GitHub
   - Sélectionner le repository

3. **Configuration**
   ```
   Build command: npm run build
   Publish directory: build
   Base directory: frontend
   ```

4. **Variables d'environnement**
   ```
   REACT_APP_API_URL=https://votre-backend.onrender.com
   ```

5. **Déployer**
   - Cliquer "Deploy site"
   - Attendre 2-3 minutes

### Option 2: Vercel

1. **Créer un compte sur [vercel.com](https://vercel.com)**

2. **Importer le projet**
   - "Add New" → "Project"
   - Importer depuis GitHub

3. **Configuration**
   ```
   Framework: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   ```

4. **Variables d'environnement**
   ```
   REACT_APP_API_URL=https://votre-backend.onrender.com
   ```

### Option 3: Render

1. **Créer un compte sur [render.com](https://render.com)**

2. **Créer un Static Site**
   - "New +" → "Static Site"
   - Connecter le repository

3. **Configuration**
   ```
   Name: clinique-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. **Variables d'environnement**
   ```
   REACT_APP_API_URL=https://votre-backend.onrender.com
   ```

---

## 🔧 Configuration de l'API

Le frontend utilise la variable d'environnement `REACT_APP_API_URL` pour se connecter au backend.

### En Développement
```env
REACT_APP_API_URL=http://localhost:5000
```

### En Production
```env
REACT_APP_API_URL=https://votre-backend.onrender.com
```

⚠️ **Important:** Remplacer `votre-backend.onrender.com` par l'URL réelle de votre backend!

---

## 🧪 Tests

### Build Local
```bash
npm run build
```

### Tester le Build
```bash
# Installer serve
npm install -g serve

# Servir le build
serve -s build -p 3000
```

Ouvrir http://localhost:3000

---

## 📝 Après le Déploiement

### 1. Mettre à jour le Backend

Sur Render, ajouter la variable d'environnement:
```
FRONTEND_URL=https://votre-frontend.netlify.app
```

### 2. Tester

1. Ouvrir le site déployé
2. Se connecter avec:
   - Email: `admin@clinique.com`
   - Password: `Admin123!`
3. Vérifier toutes les fonctionnalités

---

## 🔍 Dépannage

### Erreur: "Cannot connect to API"

**Solution:**
1. Vérifier que `REACT_APP_API_URL` est correct
2. Vérifier que le backend est déployé et fonctionne
3. Redéployer le frontend

### Erreur CORS

**Solution:**
1. Vérifier que `FRONTEND_URL` est configuré sur le backend
2. Redémarrer le backend
3. Vider le cache du navigateur

### Page Blanche

**Solution:**
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs
3. Vérifier les logs de build

---

## 📚 Documentation Complète

- **FRONTEND_QUICK_START.md** - Guide rapide (5 min)
- **DEPLOIEMENT_FRONTEND.md** - Guide complet
- **CONFIGURATION_COMPLETE.md** - Vue d'ensemble

---

**Votre frontend est prêt à être déployé!** 🎉
