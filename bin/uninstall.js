#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get the Claude agents directory
const agentsDir = path.join(os.homedir(), '.claude', 'agents');

// Check if agents directory exists
if (!fs.existsSync(agentsDir)) {
  console.log('ℹ️  No agents directory found. Nothing to uninstall.');
  process.exit(0);
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

// Remove each corresponding .md file from the agents directory
let removedCount = 0;
const removedAgents = [];

mdFiles.forEach(file => {
  try {
    const targetPath = path.join(agentsDir, file);
    
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      
      // Extract agent name from filename (remove .md extension)
      const agentName = path.basename(file, '.md');
      removedAgents.push(agentName);
      removedCount++;
      
      console.log(`🗑️  Removed: ${file}`);
    } else {
      console.log(`⚠️  Not found: ${file} (already removed or never installed)`);
    }
  } catch (error) {
    console.error(`❌ Failed to remove ${file}:`, error.message);
  }
});

if (removedCount > 0) {
  console.log(`\n✅ Successfully removed ${removedCount} MBTI coding agents from ${agentsDir}`);
  console.log('\nAgents removed:');
  removedAgents.forEach(agent => {
    console.log(`  • ${agent}`);
  });
} else {
  console.log('\nℹ️  No agents were removed.');
}

console.log('\n🧹 Uninstall complete!');