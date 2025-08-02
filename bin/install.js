#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get the Claude Code config directory
const claudeDir = path.join(os.homedir(), '.claude');

// Ensure the Claude directory exists
if (!fs.existsSync(claudeDir)) {
  fs.mkdirSync(claudeDir, { recursive: true });
}

// Agent mappings from markdown files to JSON configurations
const agents = [
  {
    name: 'enfj-team-catalyst',
    title: 'ENFJ Team Catalyst',
    description: 'Use this agent when you need to build team cohesion, develop collaborative coding practices, mentor team members with different skill levels, resolve team conflicts, or transform a group of individual developers into a high-performing collaborative unit.',
    color: 'green'
  },
  {
    name: 'enfp-enthusiasm-engine',
    title: 'ENFP Enthusiasm Engine',
    description: 'Use this agent when you need infectious enthusiasm and creative inspiration for coding projects, learning new technologies, or overcoming technical challenges. Perfect for moments when motivation is low, when exploring new technical domains, when seeking creative solutions to problems, or when you want to transform routine coding tasks into exciting adventures.',
    color: 'green'
  },
  {
    name: 'entj-project-commander',
    title: 'ENTJ Project Commander',
    description: 'Use this agent when you need decisive project leadership, strategic planning, or execution optimization. This agent excels at transforming chaotic situations into structured workflows, driving technical discussions toward concrete deliverables, and establishing clear direction for teams or complex projects.',
    color: 'purple'
  },
  {
    name: 'entp-innovation-catalyst',
    title: 'ENTP Innovation Catalyst',
    description: 'Use this agent when you want to explore breakthrough solutions, challenge conventional approaches, or generate revolutionary ideas for coding projects. Perfect for brainstorming sessions, technology experimentation, rapid prototyping, or when you\'re stuck in traditional thinking patterns and need creative disruption.',
    color: 'purple'
  },
  {
    name: 'esfj-team-harmonizer',
    title: 'ESFJ Team Harmonizer',
    description: 'Use this agent when you need to improve team collaboration, resolve communication issues, or optimize workflows for better team dynamics.',
    color: 'blue'
  },
  {
    name: 'esfp-interactive-entertainer',
    title: 'ESFP Interactive Entertainer',
    description: 'Use this agent when you want to create engaging, interactive applications with high user delight, build real-time responsive features, develop gamified experiences, create animated interfaces, or when you need energetic, encouraging support during development sessions that maintain momentum and excitement.',
    color: 'yellow'
  },
  {
    name: 'estj-business-optimizer',
    title: 'ESTJ Business Optimizer',
    description: 'Use this agent when you need business-focused technical solutions that prioritize measurable outcomes, operational efficiency, and strategic value delivery. This agent excels at treating technical decisions as business investments and optimizing development processes for maximum ROI.',
    color: 'blue'
  },
  {
    name: 'estp-entrepreneur',
    title: 'ESTP Entrepreneur',
    description: 'Use this agent when you need rapid prototyping, MVP development, market validation, or quick product iteration. Perfect for transforming ideas into functional prototypes under tight deadlines, prioritizing speed-to-market over architectural perfection.',
    color: 'yellow'
  },
  {
    name: 'infj-empathetic-mentor',
    title: 'INFJ Empathetic Mentor',
    description: 'Use this agent when users express frustration, self-doubt, or emotional barriers around coding; when they need gentle guidance through complex technical concepts; when they\'re struggling with code organization or feeling overwhelmed; when they need encouragement and personalized learning approaches; or when they\'re seeking to develop their authentic coding style.',
    color: 'green'
  },
  {
    name: 'infp-creative-muse',
    title: 'INFP Creative Muse',
    description: 'Use this agent when you want to approach programming as a form of creative self-expression, need inspiration for personal projects, seek validation for unconventional coding approaches, want to transform emotions or abstract ideas into digital experiences, or desire a deeply supportive and personally meaningful coding journey.',
    color: 'purple'
  },
  {
    name: 'intj-strategic-architect',
    title: 'INTJ Strategic Architect',
    description: 'Use this agent when you need comprehensive system architecture design, strategic technical planning, or complex problem-solving that requires deep analysis and minimal communication overhead.',
    color: 'purple'
  },
  {
    name: 'intp-theorist',
    title: 'INTP Theorist',
    description: 'Use this agent when you need deep algorithmic analysis, performance optimization, or theoretical problem-solving approaches. This agent excels at deconstructing complex coding challenges, exploring multiple solution pathways, and providing research-driven insights.',
    color: 'purple'
  },
  {
    name: 'isfj-code-protector',
    title: 'ISFJ Code Protector',
    description: 'Use this agent when you need comprehensive code stability analysis, maintenance planning, or protection against technical debt. This agent excels at transforming unreliable codebases into robust, maintainable systems through systematic improvements and protective development practices.',
    color: 'blue'
  },
  {
    name: 'isfp-aesthetic-designer',
    title: 'ISFP Aesthetic Designer',
    description: 'Use this agent when you need to create or improve user interfaces with a focus on emotional resonance and aesthetic beauty, when translating abstract design concepts into tangible visual experiences, when personalizing interfaces to match individual user preferences, or when you want to approach coding as artistic expression.',
    color: 'yellow'
  },
  {
    name: 'istj-standards-enforcer',
    title: 'ISTJ Standards Enforcer',
    description: 'Use this agent when you need to establish, enforce, or improve code quality standards, development processes, or system architecture. This agent excels at creating comprehensive frameworks for maintainable and scalable development practices.',
    color: 'blue'
  },
  {
    name: 'istp-troubleshooter',
    title: 'ISTP Troubleshooter',
    description: 'Use this agent when you need direct, efficient problem-solving for technical issues, system debugging, performance optimization, or troubleshooting concrete coding problems. This agent excels at cutting through complexity to deliver immediate, practical solutions with minimal communication overhead.',
    color: 'green'
  }
];

// Create JSON configurations for each agent
agents.forEach(agent => {
  const config = {
    name: agent.name,
    title: agent.title,
    description: agent.description,
    color: agent.color
  };
  
  const configPath = path.join(claudeDir, `${agent.name}.json`);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
});

console.log(`✅ Successfully installed ${agents.length} MBTI coding agents to ${claudeDir}`);
console.log('\\nAgents installed:');
agents.forEach(agent => {
  console.log(`  • ${agent.title} (${agent.name})`);
});
console.log('\\nYou can now use these agents in Claude Code!');