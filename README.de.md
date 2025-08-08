# MBTI Coding-Agenten

Eine umfassende Sammlung von 16 spezialisierten KI-Coding-Agenten, die jeweils auf Myers-Briggs-Persönlichkeitstypen basieren und unterschiedliche Ansätze für Softwareentwicklungsherausforderungen bieten. Jeder Agent verkörpert einzigartige Kommunikationsstile, Problemlösungsmethodologien und technische Spezialisierungen, die zu seinem MBTI-Persönlichkeitsprofil passen.

<!-- Language Navigation -->
**Languages:** [English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [Português (BR)](README.pt-BR.md) | [Français](README.fr.md) | [**Deutsch**](README.de.md) | [한국어](README.ko.md) | [العربية](README.ar.md)

---

## Installation

### Schnellstart
```bash
git clone https://github.com/weiyangzen/mbti-coding-agents.git
cd mbti-coding-agents
npm run install
```

Das Installationsprogramm fordert Sie auf, auszuwählen:
- ✅ **Claude Code** (`~/.claude/agents/`) - mit `model: opus` Konfiguration
- ✅ **Gemini CLI** (`~/.gemini/agents/`) - ohne Modellspezifikation

Beide Optionen sind standardmäßig ausgewählt.

## Deinstallation

Installierte Agenten von ausgewählten Plattformen entfernen:

```bash
npm run uninstall
```

Das Deinstallationsprogramm fordert Sie auf, auszuwählen, von welchen Plattformen Agenten entfernt werden sollen.

## 🚀 Zukunftspläne

### MBTI Squad-Befehlssystem
- [x] **Multi-Agenten-Orchestrierung**: Intelligenter `/squad` Befehl für Claude Code, der Projekte analysiert und optimale MBTI-Teamzusammensetzungen empfiehlt
- [x] **Intelligente Aufgabenverteilung**: Automatische Analyse von Projektanforderungen über mehrere Dimensionen (Pragmatismus, Innovation, Machbarkeit, Timing, Risiko)
- [x] **Rollenbasierte Zusammenarbeit**: Detaillierte Rollenzuweisungen und Kollaborationsmuster für jeden empfohlenen MBTI-Typ
- [x] **Dynamische Agentenauswahl**: Intelligenter Algorithmus, der 3-5 komplementäre Agenten basierend auf kognitiver Funktionsanalyse auswählt
- [x] **Squad-Workflows**: Phasenbasierte Workflows mit klarer Rollenverteilung und Entscheidungsrahmen
- [ ] **Agenten-übergreifende Kommunikation**: Agenten ermöglichen, Kontext zu übertragen und nahtlos auf der Arbeit anderer aufzubauen

### Erweiterte Funktionen
- [ ] **Benutzerdefinierte Agentenpersönlichkeiten**: Tools zur Erstellung hybrider Agenten oder Anpassung bestehender Persönlichkeitsprofile
- [ ] **Leistungsanalyse**: Verfolgen, welche Agenten bei verschiedenen Aufgabentypen am besten abschneiden
- [ ] **Lernsystem**: Agenten, die sich basierend auf Benutzerfeedback und Erfolgsmustern anpassen und verbessern

*Die Vision: Anstatt einzelne Agenten manuell auszuwählen, beschreiben Sie einfach Ihr Projekt und lassen Sie das MBTI-Squad sich automatisch organisieren, um verschiedene Aspekte mit den am besten geeigneten Persönlichkeiten anzugehen, die ihre Fachbereiche leiten.*

## Plattformspezifische Funktionen

### Claude Code
- **Modellkonfiguration**: Vorkonfiguriert mit `model: opus` für optimale Leistung
- **Standort**: `~/.claude/agents/`
- **Funktionen**: Vollständige Frontmatter-Metadaten mit Modellspezifikation

### Gemini CLI  
- **Modellkonfiguration**: Keine Modellspezifikation (verwendet Systemstandard)
- **Standort**: `~/.gemini/agents/`
- **Funktionen**: Sauberes Frontmatter ohne Modellbeschränkungen

### Auggie (augment-cli)
- **Status**: 🚧 In Arbeit
- **Erwarteter Standort**: `~/.auggie/agents/` (geplant)
- **Funktionen**: Noch zu bestimmen - Konfigurationsformat in Entwicklung

## Kompatibilität

✅ **Claude Code** - Vollständige Unterstützung mit Opus-Modellkonfiguration  
✅ **Gemini CLI** - Vollständige Unterstützung mit flexibler Modellauswahl  
🚧 **Auggie (augment-cli)** - In Arbeit  
✅ Jedes System, das `.md` Agentenkonfigurationen unterstützt

## Überblick

Dieses Projekt transformiert das Myers-Briggs-Typenindikator-Framework in praktische Coding-Unterstützung, indem es Agenten erstellt, die auf grundlegend verschiedene Weise denken, kommunizieren und Probleme lösen. Ob Sie strategische Architekturplanung, kreative Inspiration, systematisches Debugging oder Teamzusammenarbeitsunterstützung benötigen, es gibt einen Agenten, der speziell für Ihre Situation entwickelt wurde.

## Agentenkategorien

### Analysten (NT) - Strategisch & Systematisch
- **INTJ Strategischer Architekt** - Ultra-minimalistisches Systemdesign und Unternehmensarchitektur
- **INTP Theoretiker** - Tiefe theoretische Analyse und innovative Problemlösung
- **ENTJ Projektkommandant** - Entscheidungsstarke Führung und Ausführungsoptimierung
- **ENTP Innovationskatalysator** - Kreative technische Lösungen und schnelle Prototypenerstellung

### Diplomaten (NF) - Kreativ & Menschenzentriert
- **INFJ Empathischer Mentor** - Durchdachte Anleitung und nachhaltige Entwicklungspraktiken
- **INFP Kreative Muse** - Künstlerische Programmierung und authentischer Selbstausdruck durch Code
- **ENFJ Team-Katalysator** - Kollaborative Kulturentwicklung und Teamentwicklung
- **ENFP Enthusiasmus-Motor** - Motivationsunterstützung und kreative Erkundung

### Wächter (SJ) - Strukturiert & Zuverlässig
- **ISTJ Standards-Durchsetzer** - Codequalität, Dokumentation und Best Practices
- **ISFJ Code-Beschützer** - Defensive Programmierung und Systemzuverlässigkeit
- **ESTJ Business-Optimierer** - Prozesseffizienz und Unternehmenslösungen
- **ESFJ Team-Harmonisierer** - Kollaborative Workflows und Teamkoordination

### Entdecker (SP) - Praktisch & Anpassungsfähig
- **ISTP Problemlöser** - Direkte Problemlösung und System-Debugging
- **ISFP Ästhetischer Designer** - UI/UX-Design und visuelle Programmierung
- **ESTP Unternehmer** - Schnelle Entwicklung und marktorientierte Lösungen
- **ESFP Interaktiver Entertainer** - Benutzerengagement und interaktive Erfahrungen

## Entwicklung

### Gemini CLI Agenten generieren
Um die Gemini CLI Versionen (ohne Modellspezifikation) zu regenerieren:

```bash
npm run generate-gemini
```

Dies erstellt Agentendateien in `gemini-cli/agents/` durch Entfernen der `model: opus` Zeile aus den Claude Code Versionen.

## Verwendung

### Einzelne Agenten
Jede Agentendatei enthält:
- **Frontmatter-Metadaten** mit Name, Beschreibung, Verwendungsbeispielen und Farbkodierung
- **Detailliertes Persönlichkeitsprofil** mit Erklärung ihres Ansatzes und ihrer Spezialisierungen
- **Kommunikationsstil-Richtlinien** für authentische Interaktionsmuster
- **Technische Schwerpunktbereiche** wo sie sich auszeichnen
- **Methodologie-Frameworks** für konsistente Problemlösungsansätze

### Squad-Befehl (Claude Code)
Der `/squad` Befehl bietet intelligente Teambildung für optimale Projektplanung:

**Grundlegende Verwendung:**
```bash
/squad [Projektbeschreibung]
```

**Beispiele:**
```bash
/squad 构建一个电商平台的支付系统
/squad Build a real-time chat application with React and Node.js
/squad 优化现有数据库查询性能，减少响应时间
/squad Design and implement a machine learning recommendation engine
```

**Funktionen:**
- 🎯 **Dynamische Teamauswahl**: Wählt intelligent 3-5 MBTI-Typen basierend auf spezifischen Projektanforderungen aus
- 🧠 **Kognitive Komplementarität**: MBTI-basierte Teamauswahl für optimale kognitive Vielfalt
- ⚖️ **Ausgewogene Überlegungen**: Pragmatismus, Innovation, Machbarkeit, Timing und Risikomanagement
- 📋 **Detaillierte Empfehlungen**: Rollenzuweisungen, Kollaborationsmuster, Risikominderungsstrategien
- 🌐 **Zweisprachige Unterstützung**: Chinesische und englische Analyse und Empfehlungen
- 🔄 **Adaptive Konfiguration**: Verschiedene Projekte erhalten verschiedene Teamzusammensetzungen

**Analysedimensionen:**
1. **Legacy-Arbeit Pragmatismus** - Bewertung praktischer Ansätze für bestehende Systeme und etablierte Workflows
2. **Innovationsnovität** - Bewertung der Kreativität und Einzigartigkeit vorgeschlagener Lösungen
3. **Innovationsmachbarkeit** - Bestimmung der praktischen Umsetzbarkeit innovativer Ideen
4. **Zeitplan-Angemessenheit** - Bewertung realistischer Projektzeitpläne und Meilensteinplanung
5. **Risikoidentifikation & -minderung** - Identifizierung potenzieller Herausforderungen und Entwicklung von Notfallstrategien
6. **Teamkollaborationseffizienz** - Optimierung von Kommunikationsmustern und Workflow-Koordination
7. **Technische Komplexitätsverwaltung** - Ausbalancierung ausgeklügelter Lösungen mit wartbarer Architektur
8. **Stakeholder-Management** - Ausrichtung technischer Entscheidungen auf Geschäftsziele und Benutzerbedürfnisse

## Design-Philosophie

Als INTP, der in kleinen Entwicklungsteams arbeitet, habe ich die schöne Komplexität—und gelegentliche Reibung—menschlicher Zusammenarbeit aus erster Hand erlebt. Wir bringen alle einzigartige kognitive Muster, Kommunikationsstile und Problemlösungsansätze mit an den Tisch. Manchmal ergänzt die grenzenlose Begeisterung eines ENFP perfekt die methodische Präzision eines ISTJ. Andere Male könnte der theoretische Tieftauchgang eines INTP mit der "jetzt ausliefern" Mentalität eines ESTP kollidieren.

Dieses Projekt entstand aus einer einfachen Erkenntnis: **Wenn wir als Menschen Schwierigkeiten haben, Kommunikationslücken zwischen verschiedenen Persönlichkeitstypen zu überbrücken, warum nutzen wir nicht KI, um uns zu helfen, diese Vielfalt zu verstehen und mit ihr zu arbeiten?**

Durch die Erstellung von KI-Agenten, die verschiedene kognitive Stile verkörpern, und deren Wiederverwendung (besonders in KVCache, was viel 💰 spart), können wir:

- **Voneinander lernen**
- **Blinde Flecken füllen**
- **Kommunikationsstile überbrücken**
- **Werkzeugkasten erweitern**

Menschen haben KI gebaut, um der Menschheit zu dienen, und **bessere Software durch besseres menschliches Verständnis** zu schaffen.