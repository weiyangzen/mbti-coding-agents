# MBTI Coding Agents

A comprehensive collection of 16 specialized AI coding agents, each designed around Myers-Briggs personality types to provide distinct approaches to software development challenges. Each agent embodies unique communication styles, problem-solving methodologies, and technical specializations that match their MBTI personality profile.

## Installation

### Quick Start
```bash
git clone https://github.com/weiyangzen/mbti-coding-agents.git
cd mbti-coding-agents
npm run install
```

The installer supports both **Claude Code** and **Gemini CLI** platforms with interactive selection.

### Local Installation
Clone this repository and install agents to your preferred platform(s):

```bash
git clone https://github.com/weiyangzen/mbti-coding-agents.git
cd mbti-coding-agents
npm run install
```

The installer will prompt you to select:
- ✅ **Claude Code** (`~/.claude/agents/`) - with `model: opus` configuration
- ✅ **Gemini CLI** (`~/.gemini/agents/`) - without model specification

Both options are selected by default.

### Global Installation
Install globally and use anywhere:

```bash
npm install -g mbti-coding-agents
mbti-agents
```

### One-time Installation
Use npx for one-time installation without cloning:

```bash
npx mbti-coding-agents
```

## Uninstallation

Remove installed agents from selected platforms:

```bash
npm run uninstall
```

The uninstaller will prompt you to select which platforms to remove agents from.

## 🚀 Future Plans

### MBTI Squad Command System
- [x] **Multi-Agent Orchestration**: Intelligent `/squad` command for Claude Code that analyzes projects and recommends optimal MBTI team compositions
- [x] **Intelligent Task Distribution**: Automatically analyze project requirements across multiple dimensions (pragmatism, innovation, feasibility, timing, risk)
- [x] **Role-Based Collaboration**: Detailed role assignments and collaboration patterns for each recommended MBTI type
- [x] **Dynamic Agent Selection**: Smart algorithm that selects 3-5 complementary agents based on cognitive function analysis
- [x] **Squad Workflows**: Phase-based workflows with clear role distribution and decision-making frameworks
- [ ] **Cross-Agent Communication**: Allow agents to pass context and build upon each other's work seamlessly

### Advanced Features
- [ ] **Custom Agent Personalities**: Tools to create hybrid agents or customize existing personality profiles
- [ ] **Performance Analytics**: Track which agents perform best for different types of tasks
- [ ] **Learning System**: Agents that adapt and improve based on user feedback and success patterns

*The vision: Instead of manually selecting individual agents, simply describe your project and let the MBTI squad automatically organize itself to tackle different aspects with the most suitable personalities leading their areas of expertise.*

## Platform-Specific Features

### Claude Code
- **Model Configuration**: Pre-configured with `model: opus` for optimal performance
- **Location**: `~/.claude/agents/`
- **Features**: Full frontmatter metadata with model specification

### Gemini CLI  
- **Model Configuration**: No model specification (uses system default)
- **Location**: `~/.gemini/agents/`
- **Features**: Clean frontmatter without model constraints

### Auggie (augment-cli)
- **Status**: 🚧 Work in progress
- **Expected Location**: `~/.auggie/agents/` (planned)
- **Features**: TBD - Configuration format under development

## Compatibility

✅ **Claude Code** - Full support with Opus model configuration  
✅ **Gemini CLI** - Full support with flexible model selection  
🚧 **Auggie (augment-cli)** - Work in progress  
✅ Any system supporting `.md` agent configurations

## Overview

This project transforms the Myers-Briggs Type Indicator framework into practical coding assistance by creating agents that think, communicate, and solve problems in fundamentally different ways. Whether you need strategic architecture planning, creative inspiration, systematic debugging, or team collaboration support, there's an agent specifically designed for your situation.

## Agent Categories

### Analysts (NT) - Strategic & Systematic
- **INTJ Strategic Architect** - Ultra-minimalist system design and enterprise architecture
- **INTP Theorist** - Deep theoretical analysis and innovative problem-solving
- **ENTJ Project Commander** - Decisive leadership and execution optimization
- **ENTP Innovation Catalyst** - Creative technical solutions and rapid prototyping

### Diplomats (NF) - Creative & People-Focused
- **INFJ Empathetic Mentor** - Thoughtful guidance and sustainable development practices
- **INFP Creative Muse** - Artistic programming and authentic self-expression through code
- **ENFJ Team Catalyst** - Collaborative culture building and team development
- **ENFP Enthusiasm Engine** - Motivational support and creative exploration

### Sentinels (SJ) - Structured & Reliable
- **ISTJ Standards Enforcer** - Code quality, documentation, and best practices
- **ISFJ Code Protector** - Defensive programming and system reliability
- **ESTJ Business Optimizer** - Process efficiency and enterprise solutions
- **ESFJ Team Harmonizer** - Collaborative workflows and team coordination

### Explorers (SP) - Practical & Adaptive
- **ISTP Troubleshooter** - Direct problem-solving and system debugging
- **ISFP Aesthetic Designer** - UI/UX design and visual programming
- **ESTP Entrepreneur** - Rapid development and market-focused solutions
- **ESFP Interactive Entertainer** - User engagement and interactive experiences

## Development

### Generate Gemini CLI Agents
To regenerate the Gemini CLI versions (without model specification):

```bash
npm run generate-gemini
```

This creates agent files in `gemini-cli/agents/` by removing the `model: opus` line from Claude Code versions.

## Usage

### Individual Agents
Each agent file contains:
- **Frontmatter metadata** with name, description, usage examples, and color coding
- **Detailed personality profile** explaining their approach and specializations
- **Communication style guidelines** for authentic interaction patterns
- **Technical focus areas** where they excel
- **Methodology frameworks** for consistent problem-solving approaches

### Squad Command (Claude Code)
The `/squad` command provides intelligent team formation for optimal project planning:

**Basic Usage:**
```bash
/squad [project description]
```

**Examples:**
```bash
/squad 构建一个电商平台的支付系统
/squad Build a real-time chat application with React and Node.js
/squad 优化现有数据库查询性能，减少响应时间
/squad Design and implement a machine learning recommendation engine
```

**Features:**
- 🎯 **Dynamic Team Selection**: Intelligently selects 3-5 MBTI types based on specific project requirements
- 🧠 **Cognitive Complementarity**: MBTI-based team selection for optimal cognitive diversity
- ⚖️ **Balanced Considerations**: Pragmatism, innovation, feasibility, timing, and risk management
- 📋 **Detailed Recommendations**: Role assignments, collaboration patterns, risk mitigation strategies
- 🌐 **Bilingual Support**: Chinese and English analysis and recommendations
- 🔄 **Adaptive Configuration**: Different projects get different team compositions

**Analysis Dimensions:**
1. **存量工作务实性** - Legacy work pragmatism
2. **创新新颖性** - Innovation novelty
3. **创新可落地性** - Innovation feasibility
4. **时间节点合理性** - Timeline reasonableness
5. **风险识别与缓解** - Risk identification & mitigation
6. **团队协作效率** - Team collaboration efficiency
7. **技术复杂度管理** - Technical complexity management
8. **利益相关者管理** - Stakeholder management

**Dynamic Team Examples:**
- **E-commerce Payment** → ESTJ + ISFJ + INTJ (Business optimization + Security + Architecture)
- **AI/ML Project** → INTP + INTJ + ENTP (Research + Architecture + Innovation)
- **UI/UX Design** → ISFP + ENFP + ESFJ (Aesthetics + User experience + User care)
- **Performance Optimization** → ISTP + INTJ + ISTJ (Troubleshooting + Architecture + Standards)
- **Rapid MVP Development** → ESTP + ENTP + ENTJ (Fast execution + Innovation + Management)
- **Legacy System Maintenance** → ISFJ + ISTJ + INTJ (Code protection + Standards + Re-architecture)

## When to Use Each Agent

Choose your agent based on the type of challenge you're facing:

- **Need strategic planning?** → INTJ Strategic Architect or ENTJ Project Commander
- **Stuck on a bug?** → ISTP Troubleshooter
- **Want creative inspiration?** → INFP Creative Muse or ENFP Enthusiasm Engine
- **Building a team process?** → ENFJ Team Catalyst or ESFJ Team Harmonizer
- **Optimizing for business value?** → ESTJ Business Optimizer or ESTP Entrepreneur
- **Ensuring code quality?** → ISTJ Standards Enforcer or ISFJ Code Protector
- **Designing user experiences?** → ISFP Aesthetic Designer or ESFP Interactive Entertainer

## Implementation

These agents are designed to be used with large language models, providing distinct parameter sets and behavioral frameworks that create genuinely different coding assistance experiences. Each agent represents a complete persona with consistent problem-solving approaches, communication patterns, and technical specializations.

The goal is not just different responses, but fundamentally different ways of thinking about and approaching software development challenges.
