# Installation et Configuration - eduIA-CIEL

## Installation Rapide

### 1. Prérequis
- Node.js 18 ou supérieur
- npm (inclus avec Node.js)
- Git

### 2. Installation

```bash
# Cloner le dépôt
git clone https://github.com/toto789520/eduIA-CIEL.git
cd eduIA-CIEL

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application sera disponible sur http://localhost:3000

### 3. Compte Administrateur

Au premier démarrage, un compte administrateur est automatiquement créé :
- **Email**: `admin@eduia-ciel.local`
- **Mot de passe**: `admin123`

⚠️ **IMPORTANT**: Changez ce mot de passe immédiatement après la première connexion !

**Configuration requise** : Ajoutez l'email administrateur dans un fichier `.env.local` à la racine du projet :

```env
ADMIN_EMAILS=admin@eduia-ciel.local
```

Sans cette configuration, le compte admin ne pourra pas valider d'autres utilisateurs.

## Configuration d'Ollama

### Installation d'Ollama

#### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### macOS
```bash
brew install ollama
```

#### Windows
Téléchargez l'installeur depuis https://ollama.ai/download

### Démarrer Ollama

```bash
# Dans un terminal séparé
ollama serve
```

### Télécharger un modèle

```bash
# Modèle recommandé (léger et performant)
ollama pull llama2

# Alternatives
ollama pull mistral      # Plus performant
ollama pull codellama    # Spécialisé code
ollama pull phi          # Très léger
```

## Structure des Fichiers

```
eduIA-CIEL/
├── app/                    # Application Next.js
│   ├── api/               # Routes API
│   │   ├── chat/          # Endpoint chat IA
│   │   ├── documents/     # Gestion documents
│   │   ├── quiz/          # Génération quiz
│   │   └── evaluation/    # Évaluations interactives
│   ├── chat/              # Page chat
│   ├── documents/         # Page documents
│   ├── quiz/              # Page quiz
│   ├── evaluation/        # Page évaluation
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   └── ui/
│       └── Sidebar.tsx    # Navigation
├── public/
│   └── uploads/           # Documents téléchargés
├── package.json           # Dépendances
├── tsconfig.json          # Config TypeScript
├── next.config.js         # Config Next.js
└── postcss.config.js      # Config PostCSS

```

## Variables d'Environnement (Optionnel)

Créez un fichier `.env.local` pour personnaliser:

```env
# URL de l'API Ollama (par défaut: http://localhost:11434)
OLLAMA_API_URL=http://localhost:11434

# Modèle Ollama à utiliser (par défaut: llama2)
OLLAMA_MODEL=llama2

# Taille max des fichiers (en MB)
MAX_FILE_SIZE=10
```

## Commandes Disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Compile l'application
npm start            # Lance l'application compilée

# Linter
npm run lint         # Vérifie le code
```

## Dépannage

### Problème: Ollama ne répond pas

**Solution:**
1. Vérifiez qu'Ollama est en cours d'exécution: `ps aux | grep ollama`
2. Redémarrez Ollama: `ollama serve`
3. Vérifiez l'URL dans le code (par défaut: http://localhost:11434)

### Problème: Erreur de téléchargement de documents

**Solution:**
1. Vérifiez que le dossier `public/uploads` existe
2. Vérifiez les permissions: `chmod 755 public/uploads`

### Problème: Build échoue

**Solution:**
1. Supprimez les caches: `rm -rf .next node_modules`
2. Réinstallez: `npm install`
3. Rebuilder: `npm run build`

### Problème: Le chat IA ne fonctionne pas

**Solution:**
1. Vérifiez qu'Ollama est démarré
2. Téléchargez le modèle: `ollama pull llama2`
3. Testez Ollama: `ollama run llama2 "test"`

## Personnalisation

### Changer le modèle IA

Éditez `app/api/chat/route.ts`:
```typescript
model: 'mistral',  // au lieu de 'llama2'
```

### Modifier les couleurs

Le thème utilise Tailwind CSS. Les couleurs peuvent être personnalisées dans le code avec les classes Tailwind.

### Ajouter des exercices

Éditez `app/api/evaluation/start/route.ts` pour ajouter vos propres exercices.

## Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build et run
docker build -t eduia-ciel .
docker run -p 3000:3000 eduia-ciel
```

## Support et Contribution

- Issues: https://github.com/toto789520/eduIA-CIEL/issues
- Documentation: https://github.com/toto789520/eduIA-CIEL

## Licence

ISC License - voir LICENSE pour plus de détails
