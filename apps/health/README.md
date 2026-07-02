# 🏋️ health.thomeryhemp.com — App Santé & Training Hugo

App React personnelle de suivi santé & entraînement. Mobile-first, 100% front, données en localStorage.

## 📁 Structure

```
src/
├── App.jsx                  # Routing + navigation
├── index.css                # Design system complet
├── main.jsx                 # Entrée Vite
├── components/
│   └── NavBar.jsx           # Bottom navigation mobile
├── hooks/
│   └── useStorage.js        # Hook localStorage générique
├── pages/
│   ├── Dashboard.jsx        # Vue d'ensemble (poids, IF, hydratation, planning)
│   ├── Journal.jsx          # Saisie hebdomadaire
│   ├── Graphiques.jsx       # Courbes de progression
│   ├── PlanAlimentaire.jsx  # Wrapper → existing/plan-alimentaire-hugo.jsx
│   └── Protocole.jsx        # Wrapper → existing/protocole-training-hugo.jsx
└── existing/
    ├── plan-alimentaire-hugo.jsx      ← TON FICHIER EXISTANT
    └── protocole-training-hugo.jsx   ← TON FICHIER EXISTANT
```

## 🚀 Démarrer en local

```bash
npm install
npm run dev
# → http://localhost:5173
```

## 🏗️ Build production

```bash
npm run build
# → dossier dist/ prêt à déployer
```

## 🌐 Déploiement sur health.thomeryhemp.com via OVH + Netlify

### Étape 1 — Push sur GitHub
```bash
git init
git add .
git commit -m "init health app"
git remote add origin https://github.com/TON_USER/health-hugo.git
git push -u origin main
```

### Étape 2 — Connecter à Netlify
1. Aller sur https://app.netlify.com → "Add new site" → "Import an existing project"
2. Choisir le repo GitHub
3. Build command : `npm run build`
4. Publish directory : `dist`
5. Deploy!

### Étape 3 — Configurer le sous-domaine dans OVH
1. OVH Manager → Hébergements → thomeryhemp.com → Zone DNS
2. Ajouter un enregistrement **CNAME** :
   - Sous-domaine : `health`
   - Cible : `ton-site.netlify.app` (url fournie par Netlify)
   - TTL : 3600
3. Attendre 5-30 min de propagation DNS

### Étape 4 — Domaine custom dans Netlify
1. Netlify → Site settings → Domain management → Add custom domain
2. Entrer : `health.thomeryhemp.com`
3. Netlify provisionnera automatiquement le SSL (Let's Encrypt)

---

## Alternative — Hébergement mutualisé OVH (sans Netlify)

1. OVH Manager → Hébergements → Multisite → Ajouter un sous-domaine `health`
2. Pointer vers un dossier `/health` sur ton FTP
3. `npm run build` en local
4. Uploader le contenu de `dist/` via FTP dans `/health`
5. Créer un fichier `.htaccess` dans `/health` :

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QL]
```

---

## 📊 Données

Tout est stocké en localStorage sous les clés :
- `hugo_journal` — tableau d'entrées hebdomadaires
- `hugo_hydro_today` — hydratation du jour (remise à zéro chaque jour)

Pour exporter tes données :
```js
// Dans la console du navigateur
JSON.stringify(localStorage.getItem('hugo_journal'))
```
