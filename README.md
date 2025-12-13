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
- Terminal Linux simulé pour pratiquer les commandes
- Éditeur de code intégré
- Exercices notés automatiquement
- Feedback en temps réel
- Système de points et pourcentages

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
│   │   ├── chat/         # Chat avec IA
│   │   ├── documents/    # Gestion des documents
│   │   ├── quiz/         # Génération de quiz
│   │   └── evaluation/   # Évaluations interactives
│   ├── chat/             # Page de chat
│   ├── documents/        # Page de gestion des documents
│   ├── quiz/             # Page de quiz
│   ├── evaluation/       # Page d'évaluation
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Page d'accueil
│   └── globals.css       # Styles globaux
├── components/
│   └── ui/               # Composants UI
│       └── Sidebar.tsx   # Navigation latérale
├── public/
│   └── uploads/          # Dossier des documents téléchargés
└── package.json
```

## Technologies Utilisées

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **IA**: Ollama (Llama 2)
- **HTTP Client**: Axios

## Utilisation

### 1. Télécharger des Documents
- Accédez à la section "Documents"
- Glissez-déposez ou sélectionnez vos fichiers de cours
- Les documents sont automatiquement stockés et indexés

### 2. Discuter avec l'IA
- Allez dans "Chat IA"
- Posez des questions sur vos documents
- L'IA répond en se basant sur le contenu téléchargé

### 3. Générer des Quiz
- Cliquez sur "Quiz"
- Générez automatiquement un quiz à partir de vos documents
- Répondez aux questions et obtenez votre score

### 4. Passer une Évaluation
- Accédez à "Évaluation"
- Suivez les exercices interactifs (terminal Linux, code)
- Recevez votre note automatiquement

## Configuration d'Ollama

Par défaut, l'application utilise le modèle `llama2` et se connecte à `http://localhost:11434`. Vous pouvez personnaliser cela en créant un fichier `.env.local` :

```env
# URL de l'API Ollama
OLLAMA_API_URL=http://localhost:11434

# Modèle Ollama à utiliser
OLLAMA_MODEL=llama2
```

Vous pouvez utiliser d'autres modèles disponibles :

```bash
# Télécharger d'autres modèles
ollama pull mistral
ollama pull codellama

# Puis modifier OLLAMA_MODEL dans .env.local
```

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
Éditez `app/api/evaluation/start/route.ts` pour ajouter de nouveaux exercices.

### Modifier les prompts de l'IA
Personnalisez les prompts dans `app/api/chat/route.ts` et `app/api/quiz/route.ts`.

## Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou un pull request.

## Licence

ISC

## Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

Développé avec ❤️ pour les étudiants en BTS CIEL