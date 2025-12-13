# eduIA-CIEL

Plateforme éducative intelligente pour BTS CIEL (Cybersécurité, Informatique et réseaux, Électronique) avec intelligence artificielle intégrée.

## Fonctionnalités

### 🗂️ Gestion de Documents
- Téléchargement de documents de cours (PDF, TXT, DOC, DOCX)
- Stockage sécurisé et organisation des fichiers
- Gestion intuitive avec interface drag-and-drop

### 💬 Chat IA Interactif
- Discussion avec une IA basée sur vos documents (Ollama)
- Réponses contextuelles et personnalisées
- Support pour des questions sur le contenu des cours

### 📝 Génération de Quiz
- Création automatique de quiz à partir des documents
- Questions à choix multiples
- Correction automatique avec explications
- Suivi des scores

### 🖥️ Évaluations Interactives
- **Timer intégré** - Évaluations minutées avec compte à rebours
- **Génération IA** - Exercices générés automatiquement depuis vos fichiers de code
- Terminal Linux simulé pour pratiquer les commandes
- Éditeur de code intégré
- Exercices notés automatiquement
- Feedback en temps réel
- Système de points et pourcentages

### 👥 Système de Comptes Utilisateurs
- Inscription et connexion sécurisées
- Validation des comptes par administrateur
- Gestion de profils utilisateurs
- Organisation par catégorie (Réseaux, Cybersécurité, Programmation, etc.)

### 🏆 Classement (Leaderboard)
- Classement global et par catégorie
- Suivi des scores en temps réel
- Médailles pour les 3 premiers
- Historique des performances

### 📚 Documentation
- **Documents publics** - Partagés avec toute la classe
- **Documents privés** - Notes personnelles
- **Vue combinée** - Documentation et Chat IA côte à côte
- Catégorisation des documents
- Système de permissions

### 📧 Notifications Email
- Notification lors de la validation du compte
- Alerte sur les changements de classement
- Configuration SMTP personnalisable
- Templates HTML professionnels

### 🔄 Système de Mise à Jour
- Vérification automatique des mises à jour depuis GitHub
- Affichage des notes de version
- Suivi du dernier commit
- Instructions de mise à jour


## Prérequis

- Node.js 18+ 
- npm ou yarn
- Ollama installé localement (pour l'IA)

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/toto789520/eduIA-CIEL.git
cd eduIA-CIEL
```

2. Installez les dépendances :
```bash
npm install
```

3. Installez et démarrez Ollama :
```bash
# Sur Linux/Mac
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve

# Dans un autre terminal, téléchargez le modèle
ollama pull llama2
```

4. Démarrez l'application :
```bash
npm run dev
```

5. Ouvrez votre navigateur à [http://localhost:3000](http://localhost:3000)

## Structure du Projet

```
eduIA-CIEL/
├── app/
│   ├── api/              # API Routes
│   │   ├── admin/        # Admin endpoints (validation)
│   │   ├── auth/         # Authentication (login, register, session)
│   │   ├── chat/         # Chat avec IA
│   │   ├── docs/         # Documentation système
│   │   ├── documents/    # Gestion des documents
│   │   ├── email/        # Notifications email
│   │   ├── evaluation/   # Évaluations interactives
│   │   ├── leaderboard/  # Classement
│   │   ├── quiz/         # Génération de quiz
│   │   └── update/       # Vérification des mises à jour
│   ├── chat/             # Page de chat
│   ├── docs/             # Page de documentation
│   ├── documents/        # Page de gestion des documents
│   ├── evaluation/       # Page d'évaluation
│   ├── leaderboard/      # Page de classement
│   ├── login/            # Page de connexion
│   ├── quiz/             # Page de quiz
│   ├── register/         # Page d'inscription
│   ├── settings/         # Page de paramètres
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Page d'accueil
│   └── globals.css       # Styles globaux
├── components/
│   └── ui/               # Composants UI
│       └── Sidebar.tsx   # Navigation latérale
├── public/
│   └── uploads/          # Dossier des documents téléchargés
├── docs.json             # Base de données des documents (documentation)
├── documents.json        # Base de données des documents (fichiers)
├── users.json            # Base de données des utilisateurs
└── package.json
```

## Technologies Utilisées

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **IA**: Ollama (Llama 2)
- **HTTP Client**: Axios

## Utilisation

### 1. Créer un Compte
- Accédez à "S'inscrire"
- Remplissez vos informations
- Attendez la validation de votre compte par un administrateur
- Recevez un email de confirmation

### 2. Télécharger des Documents
- Accédez à la section "Documents"
- Glissez-déposez ou sélectionnez vos fichiers de cours
- Les documents sont automatiquement stockés et indexés

### 3. Créer de la Documentation
- Allez dans "Documentation"
- Créez des documents publics (classe) ou privés
- Utilisez le chat IA côte à côte pour poser des questions
- Organisez par catégorie

### 4. Discuter avec l'IA
- Allez dans "Chat IA"
- Posez des questions sur vos documents
- L'IA répond en se basant sur le contenu téléchargé

### 5. Générer des Quiz
- Cliquez sur "Quiz"
- Générez automatiquement un quiz à partir de vos documents
- Répondez aux questions et obtenez votre score

### 6. Passer une Évaluation
- Accédez à "Évaluation"
- Choisissez entre évaluation standard ou générée par IA depuis vos codes
- Suivez le timer et complétez les exercices interactifs
- Votre score est automatiquement ajouté au classement

### 7. Consulter le Classement
- Allez dans "Classement"
- Filtrez par catégorie
- Comparez vos performances avec les autres étudiants
- Recevez des notifications lors de changements de position

### 8. Vérifier les Mises à Jour
- Accédez à "Paramètres"
- Vérifiez les mises à jour disponibles depuis GitHub
- Configurez vos préférences email


## Configuration d'Ollama

Par défaut, l'application utilise le modèle `llama2` et se connecte à `http://localhost:11434`. Vous pouvez personnaliser cela en créant un fichier `.env.local` :

```env
# URL de l'API Ollama
OLLAMA_API_URL=http://localhost:11434

# Modèle Ollama à utiliser
OLLAMA_MODEL=llama2

# Configuration Email (optionnel)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
FROM_EMAIL=noreply@eduia-ciel.example.com
SERVER_DOMAIN=your-domain.com

# Base URL de l'application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Vous pouvez utiliser d'autres modèles disponibles :

```bash
# Télécharger d'autres modèles
ollama pull mistral
ollama pull codellama

# Puis modifier OLLAMA_MODEL dans .env.local
```

## Configuration Email

Pour activer les notifications par email :

1. Configurez les variables d'environnement SMTP dans `.env.local`
2. Les emails seront envoyés automatiquement pour :
   - Validation de compte
   - Changements de classement

**Note**: Sans configuration SMTP, les emails seront seulement loggés dans la console.


## Développement

```bash
# Mode développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

## Personnalisation

### Changer les couleurs du thème
Modifiez `tailwind.config.ts` pour ajuster les couleurs primaires.

### Ajouter des exercices d'évaluation
Éditez `app/api/evaluation/start/route.ts` pour ajouter de nouveaux exercices, ou utilisez l'endpoint `/api/evaluation/generate` pour générer des exercices depuis vos codes avec l'IA.

### Modifier les prompts de l'IA
Personnalisez les prompts dans `app/api/chat/route.ts`, `app/api/quiz/route.ts`, et `app/api/evaluation/generate/route.ts`.

### Valider les comptes utilisateurs
Les comptes nécessitent une validation manuelle. Utilisez l'endpoint `/api/admin/validate` pour valider les comptes en attente. Une fois validé, l'utilisateur reçoit un email de confirmation.

### Configurer les catégories
Modifiez les catégories disponibles dans `app/register/page.tsx` et `app/leaderboard/page.tsx` pour correspondre à vos besoins.


## Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou un pull request.

## Licence

ISC

## Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

Développé avec ❤️ pour les étudiants en BTS CIEL