# 📦 Installation des Dépendances Manquantes

## ⚠️ Problème PowerShell

Si vous obtenez une erreur "l'exécution de scripts est désactivée", utilisez l'une des solutions suivantes :

### Solution 1 : Utiliser cmd au lieu de PowerShell

Ouvrez **cmd** (Invite de commandes) au lieu de PowerShell et exécutez :

```cmd
cd "C:\Users\ADBM\Documents\projet python\frontend"
npm install framer-motion react-hot-toast
```

### Solution 2 : Activer l'exécution de scripts PowerShell

Dans PowerShell (en tant qu'administrateur) :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Puis :

```powershell
cd "C:\Users\ADBM\Documents\projet python\frontend"
npm install framer-motion react-hot-toast
```

### Solution 3 : Utiliser npx directement

```cmd
cd "C:\Users\ADBM\Documents\projet python\frontend"
npx --yes npm install framer-motion react-hot-toast
```

## ✅ Vérification

Après l'installation, vérifiez que les packages sont installés :

```bash
npm list framer-motion react-hot-toast
```

## 🚀 Redémarrer le serveur

Après l'installation :

```bash
npm start
```

