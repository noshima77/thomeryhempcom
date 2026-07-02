# GrowTrack — Guide de déploiement complet
> grow.thomeryhemp.com · Cherry Royale

---

## Architecture finale

```
GitHub (repo) ──push──▶ Netlify (build npm run build)
                              │
                              ▼
                   grow.thomeryhemp.com (CNAME Netlify)
                              │
                              │ API REST (fetch HTTPS)
                              ▼
                   Render.com (PocketBase + SQLite)
                   https://growtrack-api.onrender.com
```

---

## ÉTAPE 1 — Préparer le repo GitHub

```bash
# Dans le dossier du projet
git init
git add .
git commit -m "init: GrowTrack v1"
git remote add origin https://github.com/TON_USER/grow-thomeryhemp.git
git push -u origin main
```

---

## ÉTAPE 2 — Déployer PocketBase sur Render.com

PocketBase est un binaire Go unique — Render peut le lancer via un Docker image.

### 2a. Créer un Dockerfile pour PocketBase

Crée ce fichier `pocketbase/Dockerfile` :

```dockerfile
FROM alpine:3.19

ARG PB_VERSION=0.22.14

RUN apk add --no-cache wget unzip ca-certificates

RUN wget -q \
  "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
  -O /tmp/pb.zip && \
  unzip /tmp/pb.zip -d /pb && \
  chmod +x /pb/pocketbase

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
```

### 2b. Pousser sur GitHub et connecter à Render

1. Va sur https://render.com → **New → Web Service**
2. Connecte ton repo GitHub
3. Paramètres Render :
   - **Name** : `growtrack-api`
   - **Root Directory** : `pocketbase`
   - **Environment** : `Docker`
   - **Instance Type** : Free (suffit pour usage solo)
4. Clique **Create Web Service**
5. Render te donne une URL : `https://growtrack-api.onrender.com`

> ⚠️ **Cold start Render Free** : le service dort après 15min d'inactivité.
> Premier chargement = ~30 secondes. C'est acceptable pour usage perso.
> Pour éviter ça : passe en "Starter" à $7/mois, ou utilise un cron ping.

### 2c. Créer le compte admin PocketBase

1. Ouvre `https://growtrack-api.onrender.com/_/`
2. Crée ton compte admin (email + mot de passe fort)
3. **Note bien ces identifiants** — ils servent à te connecter dans l'app

### 2d. Créer les collections

Option A — Script automatique (si tu as accès à un terminal) :
```bash
cd pocketbase
POCKETBASE_URL=https://growtrack-api.onrender.com bash create-collections.sh
```

Option B — Interface admin (plus simple) :
Ouvre `https://growtrack-api.onrender.com/_/` et crée manuellement :

**Collection `lots`** :
| Champ | Type | Options |
|---|---|---|
| nom | text | required |
| variete | text | |
| date_lancement | date | required |
| nb_graines | number | min:1 |
| statut | select | values: germination, papier-humide, godet, croissance, pré-floraison, floraison, maturation, séchage, terminé |
| notes_generales | text | |

**Collection `journal_entries`** :
| Champ | Type | Options |
|---|---|---|
| lot_id | relation | → lots, cascade delete |
| contenu | text | required |
| type | select | values: observation, arrosage, alerte, traitement |

**Collection `photos`** :
| Champ | Type | Options |
|---|---|---|
| lot_id | relation | → lots, cascade delete |
| fichier | file | max 10MB, images seulement |
| legende | text | |

**Pour chaque collection** → onglet "API Rules" → mettre `@request.auth.id != ""` dans toutes les règles (lecture, création, update, delete).

---

## ÉTAPE 3 — Configurer Netlify

### 3a. Connecter le repo

1. Va sur https://app.netlify.com → **Add new site → Import from Git**
2. Sélectionne ton repo `grow-thomeryhemp`
3. Paramètres build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Node version** : 18 (dans Environment Variables : `NODE_VERSION = 18`)

### 3b. Ajouter la variable d'environnement

**Site Settings → Environment Variables → Add variable** :
```
VITE_POCKETBASE_URL = https://growtrack-api.onrender.com
```

Puis **Deploys → Trigger deploy** pour prendre en compte la variable.

### 3c. Configurer le domaine custom

1. **Site Settings → Domain management → Add custom domain**
2. Saisis : `grow.thomeryhemp.com`
3. Netlify te donne une valeur CNAME, par exemple : `amazing-cupcake-123.netlify.app`

Dans l'interface DNS OVH :
```
Type    : CNAME
Nom     : grow
Cible   : amazing-cupcake-123.netlify.app.
TTL     : 3600
```

4. Netlify génère automatiquement le certificat HTTPS (Let's Encrypt) — attendre ~10min.

---

## ÉTAPE 4 — Configurer CORS sur PocketBase

Pour autoriser Netlify à appeler l'API PocketBase, dans l'Admin UI :

**Settings → Application → Allowed Origins** :
```
https://grow.thomeryhemp.com
https://grow-thomeryhemp.netlify.app
http://localhost:5173
```

---

## ÉTAPE 5 — Test complet

1. Ouvre `https://grow.thomeryhemp.com`
2. Connecte-toi avec tes identifiants admin PocketBase
3. Crée un lot "Lot A"
4. Ajoute une entrée journal
5. Ajoute une photo
6. Vérifie l'export PDF et CSV

---

## Workflow de développement local

```bash
# 1. Cloner le repo
git clone https://github.com/TON_USER/grow-thomeryhemp.git
cd grow-thomeryhemp

# 2. Copier le fichier d'environnement
cp .env.example .env.local
# Éditer .env.local : mettre l'URL Render OU localhost:8090 si PocketBase local

# 3. Installer les dépendances
npm install

# 4. Lancer en dev
npm run dev
# → http://localhost:5173
```

---

## Structure des fichiers

```
grow-thomeryhemp/
├── src/
│   ├── App.jsx                  # Shell + routing + header
│   ├── App.css                  # Tous les styles
│   ├── main.jsx                 # Point d'entrée React
│   ├── context/
│   │   └── LotsContext.jsx      # State global + appels API PocketBase
│   ├── pages/
│   │   ├── Dashboard.jsx        # Vue d'ensemble des lots
│   │   ├── LotDetail.jsx        # Détail lot + journal + photos + rappels
│   │   └── CreateLot.jsx        # Formulaire création lot
│   ├── components/
│   │   ├── LotCard.jsx          # Carte lot (dashboard)
│   │   ├── StatusBadge.jsx      # Badge de stade
│   │   ├── ProgressBar.jsx      # Barre de progression
│   │   ├── JournalEntry.jsx     # Entrée journal
│   │   ├── PhotoGallery.jsx     # Galerie + modale
│   │   └── LoginForm.jsx        # Formulaire login
│   └── utils/
│       ├── stageUtils.js        # Stades, J+X, progression
│       └── exportUtils.js       # Export PDF (jsPDF) + CSV
├── pocketbase/
│   ├── Dockerfile               # Pour Render.com
│   ├── setup-pocketbase.sh      # Setup VPS (alternatif)
│   └── create-collections.sh   # Création collections via API
├── index.html
├── vite.config.js
├── package.json
├── netlify.toml                 # Redirects SPA
└── .env.example
```

---

## Résolution de problèmes fréquents

| Symptôme | Cause | Solution |
|---|---|---|
| Login échoue | CORS bloqué | Vérifier Allowed Origins dans PocketBase |
| Photos ne s'affichent pas | CORS sur fichiers | Même fix CORS |
| App lente au démarrage | Cold start Render | Normal, passer en Starter si gênant |
| Données perdues au refresh | Variable VITE_ absente | Re-vérifier env var Netlify + redeploy |
| Build Netlify échoue | Node version | Ajouter `NODE_VERSION=18` dans env vars |

---

## Évolutions futures possibles

- **PWA offline-first** : ajouter `vite-plugin-pwa` pour service worker
- **Notifications push** : PocketBase hooks + Web Push API
- **Grafiques de croissance** : Recharts avec données journal
- **Timeline visuelle** : vue chronologique de chaque lot
- **Export photo ZIP** : télécharger toute la galerie d'un lot
