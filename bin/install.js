#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get the Claude agents directory
const agentsDir = path.join(os.homedir(), '.claude', 'agents');

// Ensure the agents directory exists
if (!fs.existsSync(agentsDir)) {
  fs.mkdirSync(agentsDir, { recursive: true });
}

// Get all .md files from the claude/agents directory
const currentDir = process.cwd();
const sourceAgentsDir = path.join(currentDir, 'claude', 'agents');

// Check if source directory exists
if (!fs.existsSync(sourceAgentsDir)) {
  console.error('❌ Source directory claude/agents/ not found');
  process.exit(1);
}

const mdFiles = fs.readdirSync(sourceAgentsDir)
  .filter(file => file.endsWith('.md'))
  .sort();

if (mdFiles.length === 0) {
  console.error('❌ No agent .md files found in claude/agents/ directory');
  process.exit(1);
}

// Copy each .md file to the agents directory
let installedCount = 0;
const installedAgents = [];

mdFiles.forEach(file => {
  try {
    const sourcePath = path.join(sourceAgentsDir, file);
    const targetPath = path.join(agentsDir, file);
    
    // Copy the file
    fs.copyFileSync(sourcePath, targetPath);
    
    // Extract agent name from filename (remove .md extension)
    const agentName = path.basename(file, '.md');
    installedAgents.push(agentName);
    installedCount++;
    
    console.log(`📄 Installed: ${file}`);
  } catch (error) {
    console.error(`❌ Failed to install ${file}:`, error.message);
  }
});

console.log(`\n✅ Successfully installed ${installedCount} MBTI coding agents to ${agentsDir}`);
console.log('\nAgents installed:');
installedAgents.forEach(agent => {
  console.log(`  • ${agent}`);
});
console.log('\n🎉 You can now use these agents in Claude Code!');