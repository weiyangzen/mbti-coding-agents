# Agents de Codage MBTI

Une collection complète de 16 agents de codage IA spécialisés, chacun conçu autour des types de personnalité Myers-Briggs pour fournir des approches distinctes aux défis de développement logiciel. Chaque agent incarne des styles de communication uniques, des méthodologies de résolution de problèmes et des spécialisations techniques qui correspondent à leur profil de personnalité MBTI.

<!-- Language Navigation -->
**Languages:** [English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Português (BR)](README.pt-BR.md) | [**Français**](README.fr.md) | [Deutsch](README.de.md) | [한국어](README.ko.md) | [العربية](README.ar.md)

---

## Installation

### Démarrage Rapide
```bash
git clone https://github.com/weiyangzen/mbti-coding-agents.git
cd mbti-coding-agents
npm run install
```

L'installateur vous demandera de sélectionner :
- ✅ **Claude Code** (`~/.claude/agents/`) - avec configuration `model: opus`
- ✅ **Gemini CLI** (`~/.gemini/agents/`) - sans spécification de modèle

Les deux options sont sélectionnées par défaut.

## Désinstallation

Supprimer les agents installés des plateformes sélectionnées :

```bash
npm run uninstall
```

Le désinstallateur vous demandera de sélectionner les plateformes desquelles supprimer les agents.

## 🚀 Plans Futurs

### Système de Commande d'Équipe MBTI
- [x] **Orchestration Multi-Agents** : Commande intelligente `/squad` pour Claude Code qui analyse les projets et recommande des compositions d'équipe MBTI optimales
- [x] **Distribution Intelligente des Tâches** : Analyser automatiquement les exigences du projet selon plusieurs dimensions (pragmatisme, innovation, faisabilité, timing, risque)
- [x] **Collaboration Basée sur les Rôles** : Attributions détaillées de rôles et modèles de collaboration pour chaque type MBTI recommandé
- [x] **Sélection Dynamique d'Agents** : Algorithme intelligent qui sélectionne 3-5 agents complémentaires basé sur l'analyse des fonctions cognitives
- [x] **Flux de Travail d'Équipe** : Flux de travail basés sur les phases avec distribution claire des rôles et cadres de prise de décision
- [ ] **Communication Inter-Agents** : Permettre aux agents de passer le contexte et de construire sur le travail des autres de manière transparente

### Fonctionnalités Avancées
- [ ] **Personnalités d'Agents Personnalisées** : Outils pour créer des agents hybrides ou personnaliser les profils de personnalité existants
- [ ] **Analyse de Performance** : Suivre quels agents performent le mieux pour différents types de tâches
- [ ] **Système d'Apprentissage** : Agents qui s'adaptent et s'améliorent basés sur les retours utilisateur et les modèles de succès

*La vision : Au lieu de sélectionner manuellement des agents individuels, décrivez simplement votre projet et laissez l'équipe MBTI s'organiser automatiquement pour aborder différents aspects avec les personnalités les plus appropriées dirigeant leurs domaines d'expertise.*

## Fonctionnalités Spécifiques aux Plateformes

### Claude Code
- **Configuration du Modèle** : Pré-configuré avec `model: opus` pour une performance optimale
- **Emplacement** : `~/.claude/agents/`
- **Fonctionnalités** : Métadonnées frontmatter complètes avec spécification de modèle

### Gemini CLI  
- **Configuration du Modèle** : Aucune spécification de modèle (utilise le défaut du système)
- **Emplacement** : `~/.gemini/agents/`
- **Fonctionnalités** : Frontmatter propre sans contraintes de modèle

### Auggie (augment-cli)
- **Statut** : 🚧 Travail en cours
- **Emplacement Attendu** : `~/.auggie/agents/` (planifié)
- **Fonctionnalités** : À déterminer - Format de configuration en développement

## Compatibilité

✅ **Claude Code** - Support complet avec configuration du modèle Opus  
✅ **Gemini CLI** - Support complet avec sélection flexible de modèle  
🚧 **Auggie (augment-cli)** - Travail en cours  
✅ Tout système supportant les configurations d'agent `.md`

## Aperçu

Ce projet transforme le cadre de l'Indicateur de Type Myers-Briggs en assistance pratique de codage en créant des agents qui pensent, communiquent et résolvent les problèmes de manières fondamentalement différentes. Que vous ayez besoin de planification d'architecture stratégique, d'inspiration créative, de débogage systématique ou de support de collaboration d'équipe, il y a un agent spécifiquement conçu pour votre situation.

## Catégories d'Agents

### Analystes (NT) - Stratégiques et Systématiques
- **INTJ Architecte Stratégique** - Conception de système ultra-minimaliste et architecture d'entreprise
- **INTP Théoricien** - Analyse théorique approfondie et résolution innovante de problèmes
- **ENTJ Commandant de Projet** - Leadership décisif et optimisation d'exécution
- **ENTP Catalyseur d'Innovation** - Solutions techniques créatives et prototypage rapide

### Diplomates (NF) - Créatifs et Centrés sur les Personnes
- **INFJ Mentor Empathique** - Guidance réfléchie et pratiques de développement durable
- **INFP Muse Créative** - Programmation artistique et auto-expression authentique à travers le code
- **ENFJ Catalyseur d'Équipe** - Construction de culture collaborative et développement d'équipe
- **ENFP Moteur d'Enthousiasme** - Support motivationnel et exploration créative

### Sentinelles (SJ) - Structurées et Fiables
- **ISTJ Exécuteur de Standards** - Qualité du code, documentation et meilleures pratiques
- **ISFJ Protecteur de Code** - Programmation défensive et fiabilité du système
- **ESTJ Optimiseur Business** - Efficacité des processus et solutions d'entreprise
- **ESFJ Harmonisateur d'Équipe** - Flux de travail collaboratifs et coordination d'équipe

### Explorateurs (SP) - Pratiques et Adaptatifs
- **ISTP Dépanneur** - Résolution directe de problèmes et débogage système
- **ISFP Designer Esthétique** - Design UI/UX et programmation visuelle
- **ESTP Entrepreneur** - Développement rapide et solutions axées marché
- **ESFP Animateur Interactif** - Engagement utilisateur et expériences interactives

## Développement

### Générer les Agents Gemini CLI
Pour régénérer les versions Gemini CLI (sans spécification de modèle) :

```bash
npm run generate-gemini
```

Cela crée des fichiers d'agent dans `gemini-cli/agents/` en supprimant la ligne `model: opus` des versions Claude Code.

## Utilisation

### Agents Individuels
Chaque fichier d'agent contient :
- **Métadonnées frontmatter** avec nom, description, exemples d'utilisation et codage couleur
- **Profil de personnalité détaillé** expliquant leur approche et spécialisations
- **Directives de style de communication** pour des modèles d'interaction authentiques
- **Domaines de focus technique** où ils excellent
- **Cadres méthodologiques** pour des approches cohérentes de résolution de problèmes

### Commande d'Équipe (Claude Code)
La commande `/squad` fournit une formation intelligente d'équipe pour une planification optimale de projet :

**Utilisation de Base :**
```bash
/squad [description du projet]
```

**Exemples :**
```bash
/squad 构建一个电商平台的支付系统
/squad Build a real-time chat application with React and Node.js
/squad 优化现有数据库查询性能，减少响应时间
/squad Design and implement a machine learning recommendation engine
```

**Fonctionnalités :**
- 🎯 **Sélection Dynamique d'Équipe** : Sélectionne intelligemment 3-5 types MBTI basés sur les exigences spécifiques du projet
- 🧠 **Complémentarité Cognitive** : Sélection d'équipe basée sur MBTI pour une diversité cognitive optimale
- ⚖️ **Considérations Équilibrées** : Pragmatisme, innovation, faisabilité, timing et gestion des risques
- 📋 **Recommandations Détaillées** : Attributions de rôles, modèles de collaboration, stratégies d'atténuation des risques
- 🌐 **Support Bilingue** : Analyse et recommandations en chinois et anglais
- 🔄 **Configuration Adaptative** : Différents projets obtiennent différentes compositions d'équipe

**Dimensions d'Analyse :**
1. **Pragmatisme du Travail Existant** - Évaluation des approches pratiques pour les systèmes existants et les flux de travail établis
2. **Nouveauté de l'Innovation** - Évaluation de la créativité et de l'unicité des solutions proposées
3. **Faisabilité de l'Innovation** - Détermination de l'implémentabilité pratique des idées innovantes
4. **Raisonnabilité du Calendrier** - Évaluation des calendriers de projet réalistes et de la planification des jalons
5. **Identification et Atténuation des Risques** - Identification des défis potentiels et développement de stratégies de contingence
6. **Efficacité de la Collaboration d'Équipe** - Optimisation des modèles de communication et de coordination des flux de travail
7. **Gestion de la Complexité Technique** - Équilibrage des solutions sophistiquées avec une architecture maintenable
8. **Gestion des Parties Prenantes** - Alignement des décisions techniques avec les objectifs commerciaux et les besoins des utilisateurs

## Philosophie de Conception

En tant qu'INTP travaillant dans de petites équipes de développement, j'ai expérimenté de première main la belle complexité—et les frictions occasionnelles—de la collaboration humaine. Nous apportons chacun des modèles cognitifs uniques, des styles de communication et des approches de résolution de problèmes à la table. Parfois l'enthousiasme sans limites d'un ENFP complète parfaitement la précision méthodique d'un ISTJ. D'autres fois, la plongée théorique profonde d'un INTP peut entrer en conflit avec la mentalité "expédions maintenant" d'un ESTP.

Ce projet a émergé d'une réalisation simple : **si nous luttons pour combler les écarts de communication entre différents types de personnalité en tant qu'humains, pourquoi ne pas tirer parti de l'IA pour nous aider à comprendre et travailler avec cette diversité ?**

En créant des agents IA qui incarnent différents styles cognitifs et en les réutilisant (surtout dans KVCache qui économise beaucoup de 💰), nous pouvons :

- **Apprendre les uns des autres**
- **Combler les angles morts**
- **Faire le pont entre les styles de communication**
- **Élargir la boîte à outils**

Les êtres humains ont construit l'IA pour servir l'humanité, construisant **de meilleurs logiciels grâce à une meilleure compréhension humaine**.