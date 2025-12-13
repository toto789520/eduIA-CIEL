# Guide d'Utilisation - eduIA-CIEL

## Vue d'Ensemble

eduIA-CIEL est une plateforme éducative interactive pour les étudiants en BTS CIEL (Cybersécurité, Informatique et réseaux, Électronique). Elle offre quatre modules principaux:

1. 📄 **Gestion de Documents**
2. 💬 **Chat IA**
3. 📝 **Quiz Interactifs**
4. 🖥️ **Évaluations Notées**

## 1. Gestion de Documents

### Télécharger des Documents

1. Cliquez sur **"Documents"** dans la barre latérale
2. Cliquez dans la zone de téléchargement ou glissez-déposez vos fichiers
3. Formats supportés: PDF, TXT, DOC, DOCX
4. Plusieurs fichiers peuvent être téléchargés simultanément

### Gérer vos Documents

- **Voir la liste**: Tous les documents apparaissent avec leur nom, taille et date
- **Supprimer**: Cliquez sur l'icône corbeille pour supprimer un document

### Bonnes Pratiques

- Nommez vos fichiers de manière claire (ex: "cours-linux-semaine1.pdf")
- Organisez vos documents par thème
- Les fichiers TXT sont les plus faciles à indexer pour l'IA

## 2. Chat IA

### Démarrer une Conversation

1. Allez dans **"Chat IA"**
2. L'IA vous accueille et est prête à répondre
3. Tapez votre question dans le champ en bas
4. Cliquez sur "Envoyer" ou appuyez sur Entrée

### Types de Questions

#### Questions sur les Documents
```
"Explique-moi le chapitre sur les réseaux TCP/IP"
"Quels sont les principaux protocoles de sécurité?"
"Résume le cours sur Linux"
```

#### Questions Générales BTS CIEL
```
"Comment fonctionne un pare-feu?"
"Qu'est-ce qu'un terminal Linux?"
"Explique les permissions de fichiers"
```

#### Aide aux Devoirs
```
"Comment créer un utilisateur sous Linux?"
"Aide-moi à comprendre les adresses IP"
"Donne-moi des exemples de commandes bash"
```

### Conseils

- Posez des questions précises
- Si la réponse n'est pas claire, reformulez
- L'IA utilise le contenu de vos documents pour répondre
- Plus vous avez de documents, meilleures seront les réponses

## 3. Quiz Interactifs

### Générer un Quiz

1. Cliquez sur **"Quiz"**
2. Cliquez sur **"Générer un Quiz"**
3. L'IA crée automatiquement 5 questions basées sur vos documents
4. Attendez quelques secondes pendant la génération

### Passer le Quiz

1. Lisez attentivement chaque question
2. Sélectionnez votre réponse parmi les 4 options
3. Utilisez "Suivant" pour avancer
4. Utilisez "Précédent" pour revenir en arrière
5. Cliquez sur "Soumettre" à la dernière question

### Voir les Résultats

- Les réponses correctes sont en **vert** ✓
- Les réponses incorrectes sont en **rouge** ✗
- Lisez les explications pour comprendre vos erreurs
- Votre score s'affiche en pourcentage

### Conseils

- Prenez votre temps pour lire les questions
- Lisez toutes les options avant de répondre
- Consultez les explications pour apprendre
- Refaites des quiz pour améliorer vos scores

## 4. Évaluations Interactives

### Démarrer une Évaluation

1. Allez dans **"Évaluation"**
2. Cliquez sur **"Commencer l'Évaluation"**
3. L'évaluation contient plusieurs exercices pratiques

### Types d'Exercices

#### Terminal Linux
- **Interface**: Terminal noir avec texte vert
- **Utilisation**: Tapez vos commandes et appuyez sur Entrée
- **Commandes de base**: `ls`, `pwd`, `mkdir`, `chmod`, `cd`
- **Aide**: Tapez `help` pour voir les commandes disponibles

**Exemple d'exercice:**
```
Tâche: Listez tous les fichiers avec détails
Commande attendue: ls -la
```

#### Code/Script
- **Interface**: Éditeur de code
- **Utilisation**: Écrivez votre code et cliquez sur "Soumettre"
- **Langages**: Bash, Python, selon l'exercice

**Exemple d'exercice:**
```
Tâche: Script affichant "Hello BTS CIEL" et la date
Solution:
#!/bin/bash
echo "Hello BTS CIEL"
date
```

### Système de Notation

- Chaque exercice vaut un certain nombre de points
- Les réponses correctes donnent tous les points
- Les réponses incorrectes donnent des indices
- Le score final est calculé en pourcentage

### Navigation

- **Progression**: Barre bleue en haut
- **Points**: Affichés pour chaque exercice
- **Feedback**: Messages de validation ou indices
- **Automatique**: Passage au suivant après succès

### Résultats Finaux

À la fin de l'évaluation:
- Score en pourcentage (%)
- Points obtenus / Points totaux
- Barre de progression colorée
- Option de recommencer

## Conseils Généraux

### Pour Réussir

1. **Téléchargez vos documents**: Plus vous avez de contenu, mieux l'IA vous aide
2. **Pratiquez régulièrement**: Utilisez les quiz et évaluations fréquemment
3. **Lisez les explications**: Apprenez de vos erreurs
4. **Posez des questions**: Le chat IA est là pour vous aider

### Optimisation

- **Documents TXT**: Plus faciles à analyser par l'IA
- **Nommage clair**: Aide à retrouver vos fichiers
- **Sessions courtes**: Mieux vaut plusieurs courtes sessions qu'une longue

### Dépannage

#### L'IA ne répond pas
- Vérifiez qu'Ollama est démarré (`ollama serve`)
- Attendez quelques secondes pour la réponse
- Reformulez votre question

#### Pas de documents dans le chat
- Téléchargez d'abord des documents
- Utilisez des fichiers TXT pour un meilleur résultat

#### Quiz ne se génère pas
- Assurez-vous d'avoir des documents téléchargés
- Ollama doit être en cours d'exécution
- Patientez quelques secondes

## Raccourcis Clavier

### Chat
- **Entrée**: Envoyer le message

### Terminal (Évaluation)
- **Entrée**: Exécuter la commande
- **help**: Liste des commandes disponibles

### Navigation
- Utilisez la barre latérale pour changer de section

## Bonnes Pratiques BTS CIEL

### Linux
- Apprenez les commandes de base: `ls`, `cd`, `mkdir`, `rm`, `chmod`
- Comprenez les permissions (rwx)
- Pratiquez avec le terminal simulé

### Réseaux
- Étudiez TCP/IP, DNS, DHCP
- Comprenez les protocoles de sécurité
- Posez des questions sur les configurations

### Programmation
- Pratiquez Bash et Python
- Testez votre code dans l'évaluateur
- Demandez des exemples à l'IA

## Support

Besoin d'aide?
- Consultez `INSTALLATION.md` pour les problèmes techniques
- Ouvrez une issue sur GitHub
- Contactez votre enseignant

---

**Bon apprentissage avec eduIA-CIEL!** 🎓
