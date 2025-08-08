# Agentes de Codificação MBTI

Uma coleção abrangente de 16 agentes de codificação IA especializados, cada um projetado com base nos tipos de personalidade Myers-Briggs para fornecer abordagens distintas aos desafios de desenvolvimento de software. Cada agente incorpora estilos de comunicação únicos, metodologias de resolução de problemas e especializações técnicas que correspondem ao seu perfil de personalidade MBTI.

<!-- Language Navigation -->
**Languages:** [English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [**Português (BR)**](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [한국어](README.ko.md) | [العربية](README.ar.md)

---

## Instalação

### Início Rápido
```bash
git clone https://github.com/weiyangzen/mbti-coding-agents.git
cd mbti-coding-agents
npm run install
```

O instalador solicitará que você selecione:
- ✅ **Claude Code** (`~/.claude/agents/`) - com configuração `model: opus`
- ✅ **Gemini CLI** (`~/.gemini/agents/`) - sem especificação de modelo

Ambas as opções são selecionadas por padrão.

## Desinstalação

Remover agentes instalados das plataformas selecionadas:

```bash
npm run uninstall
```

O desinstalador solicitará que você selecione de quais plataformas remover os agentes.

## 🚀 Planos Futuros

### Sistema de Comando de Esquadrão MBTI
- [x] **Orquestração Multi-Agente**: Comando inteligente `/squad` para Claude Code que analisa projetos e recomenda composições ideais de equipe MBTI
- [x] **Distribuição Inteligente de Tarefas**: Analisar automaticamente os requisitos do projeto em múltiplas dimensões (pragmatismo, inovação, viabilidade, cronograma, risco)
- [x] **Colaboração Baseada em Papéis**: Atribuições detalhadas de papéis e padrões de colaboração para cada tipo MBTI recomendado
- [x] **Seleção Dinâmica de Agentes**: Algoritmo inteligente que seleciona 3-5 agentes complementares baseado na análise de funções cognitivas
- [x] **Fluxos de Trabalho de Esquadrão**: Fluxos de trabalho baseados em fases com distribuição clara de papéis e estruturas de tomada de decisão
- [ ] **Comunicação Entre Agentes**: Permitir que agentes passem contexto e construam sobre o trabalho uns dos outros de forma contínua

### Recursos Avançados
- [ ] **Personalidades de Agentes Personalizadas**: Ferramentas para criar agentes híbridos ou personalizar perfis de personalidade existentes
- [ ] **Análise de Performance**: Rastrear quais agentes têm melhor desempenho para diferentes tipos de tarefas
- [ ] **Sistema de Aprendizagem**: Agentes que se adaptam e melhoram baseados no feedback do usuário e padrões de sucesso

*A visão: Em vez de selecionar manualmente agentes individuais, simplesmente descreva seu projeto e deixe o esquadrão MBTI se organizar automaticamente para abordar diferentes aspectos com as personalidades mais adequadas liderando suas áreas de especialização.*

## Recursos Específicos da Plataforma

### Claude Code
- **Configuração do Modelo**: Pré-configurado com `model: opus` para performance otimizada
- **Localização**: `~/.claude/agents/`
- **Recursos**: Metadados frontmatter completos com especificação de modelo

### Gemini CLI  
- **Configuração do Modelo**: Sem especificação de modelo (usa padrão do sistema)
- **Localização**: `~/.gemini/agents/`
- **Recursos**: Frontmatter limpo sem restrições de modelo

### Auggie (augment-cli)
- **Status**: 🚧 Trabalho em progresso
- **Localização Esperada**: `~/.auggie/agents/` (planejado)
- **Recursos**: A definir - Formato de configuração em desenvolvimento

## Compatibilidade

✅ **Claude Code** - Suporte completo com configuração do modelo Opus  
✅ **Gemini CLI** - Suporte completo com seleção flexível de modelo  
🚧 **Auggie (augment-cli)** - Trabalho em progresso  
✅ Qualquer sistema que suporte configurações de agente `.md`

## Visão Geral

Este projeto transforma a estrutura do Indicador de Tipo Myers-Briggs em assistência prática de codificação, criando agentes que pensam, se comunicam e resolvem problemas de maneiras fundamentalmente diferentes. Se você precisa de planejamento de arquitetura estratégica, inspiração criativa, depuração sistemática ou suporte de colaboração em equipe, há um agente especificamente projetado para sua situação.

## Categorias de Agentes

### Analistas (NT) - Estratégicos e Sistemáticos
- **INTJ Arquiteto Estratégico** - Design de sistema ultra-minimalista e arquitetura empresarial
- **INTP Teórico** - Análise teórica profunda e resolução inovadora de problemas
- **ENTJ Comandante de Projeto** - Liderança decisiva e otimização de execução
- **ENTP Catalisador de Inovação** - Soluções técnicas criativas e prototipagem rápida

### Diplomatas (NF) - Criativos e Focados em Pessoas
- **INFJ Mentor Empático** - Orientação reflexiva e práticas de desenvolvimento sustentável
- **INFP Musa Criativa** - Programação artística e autoexpressão autêntica através do código
- **ENFJ Catalisador de Equipe** - Construção de cultura colaborativa e desenvolvimento de equipe
- **ENFP Motor de Entusiasmo** - Suporte motivacional e exploração criativa

### Sentinelas (SJ) - Estruturados e Confiáveis
- **ISTJ Executor de Padrões** - Qualidade de código, documentação e melhores práticas
- **ISFJ Protetor de Código** - Programação defensiva e confiabilidade do sistema
- **ESTJ Otimizador de Negócios** - Eficiência de processos e soluções empresariais
- **ESFJ Harmonizador de Equipe** - Fluxos de trabalho colaborativos e coordenação de equipe

### Exploradores (SP) - Práticos e Adaptativos
- **ISTP Solucionador de Problemas** - Resolução direta de problemas e depuração de sistema
- **ISFP Designer Estético** - Design UI/UX e programação visual
- **ESTP Empreendedor** - Desenvolvimento rápido e soluções focadas no mercado
- **ESFP Animador Interativo** - Engajamento do usuário e experiências interativas

## Desenvolvimento

### Gerar Agentes Gemini CLI
Para regenerar as versões Gemini CLI (sem especificação de modelo):

```bash
npm run generate-gemini
```

Isso cria arquivos de agente em `gemini-cli/agents/` removendo a linha `model: opus` das versões Claude Code.

## Uso

### Agentes Individuais
Cada arquivo de agente contém:
- **Metadados frontmatter** com nome, descrição, exemplos de uso e codificação de cores
- **Perfil de personalidade detalhado** explicando sua abordagem e especializações
- **Diretrizes de estilo de comunicação** para padrões de interação autênticos
- **Áreas de foco técnico** onde eles se destacam
- **Estruturas metodológicas** para abordagens consistentes de resolução de problemas

### Comando de Esquadrão (Claude Code)
O comando `/squad` fornece formação inteligente de equipe para planejamento otimizado de projeto:

**Uso Básico:**
```bash
/squad [descrição do projeto]
```

**Exemplos:**
```bash
/squad 构建一个电商平台的支付系统
/squad Build a real-time chat application with React and Node.js
/squad 优化现有数据库查询性能，减少响应时间
/squad Design and implement a machine learning recommendation engine
```

**Recursos:**
- 🎯 **Seleção Dinâmica de Equipe**: Seleciona inteligentemente 3-5 tipos MBTI baseados em requisitos específicos do projeto
- 🧠 **Complementaridade Cognitiva**: Seleção de equipe baseada em MBTI para diversidade cognitiva otimizada
- ⚖️ **Considerações Equilibradas**: Pragmatismo, inovação, viabilidade, cronograma e gerenciamento de risco
- 📋 **Recomendações Detalhadas**: Atribuições de papéis, padrões de colaboração, estratégias de mitigação de risco
- 🌐 **Suporte Bilíngue**: Análise e recomendações em chinês e inglês
- 🔄 **Configuração Adaptativa**: Diferentes projetos recebem diferentes composições de equipe

**Dimensões de Análise:**
1. **Pragmatismo do Trabalho Legado** - Avaliando abordagens práticas para sistemas existentes e fluxos de trabalho estabelecidos
2. **Novidade da Inovação** - Avaliando a criatividade e singularidade das soluções propostas
3. **Viabilidade da Inovação** - Determinando a implementabilidade prática de ideias inovadoras
4. **Razoabilidade do Cronograma** - Avaliando cronogramas realistas de projeto e planejamento de marcos
5. **Identificação e Mitigação de Riscos** - Identificando desafios potenciais e desenvolvendo estratégias de contingência
6. **Eficiência da Colaboração em Equipe** - Otimizando padrões de comunicação e coordenação de fluxo de trabalho
7. **Gerenciamento da Complexidade Técnica** - Equilibrando soluções sofisticadas com arquitetura sustentável
8. **Gerenciamento de Stakeholders** - Alinhando decisões técnicas com objetivos de negócio e necessidades do usuário

## Filosofia de Design

Como um INTP trabalhando em pequenas equipes de desenvolvimento, experimentei em primeira mão a bela complexidade—e o atrito ocasional—da colaboração humana. Cada um de nós traz padrões cognitivos únicos, estilos de comunicação e abordagens de resolução de problemas para a mesa. Às vezes o entusiasmo ilimitado de um ENFP complementa perfeitamente a precisão metódica de um ISTJ. Outras vezes, o mergulho teórico profundo de um INTP pode entrar em conflito com a mentalidade "lance agora" de um ESTP.

Este projeto emergiu de uma percepção simples: **se lutamos para superar lacunas de comunicação entre diferentes tipos de personalidade como humanos, por que não aproveitar a IA para nos ajudar a entender e trabalhar com essa diversidade?**

Ao criar agentes de IA que incorporam diferentes estilos cognitivos e reutilizá-los (especialmente no KVCache que economiza muito 💰), podemos:

- **Aprender uns com os outros**
- **Preencher pontos cegos**
- **Conectar estilos de comunicação**
- **Expandir kit de ferramentas**

Os seres humanos construíram a IA para servir à humanidade, construindo **melhor software através de melhor compreensão humana**.