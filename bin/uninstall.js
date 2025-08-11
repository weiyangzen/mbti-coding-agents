#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const cp = require('child_process');

async function main() {
  console.log('🗑️  MBTI Coding Agents Uninstaller\n');
  
  // Ask user which platforms to uninstall from
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Select platforms to uninstall agents from:',
      choices: [
        { name: 'Claude Code (~/.claude/agents/)', value: 'claude', checked: true },
        { name: 'Gemini CLI (~/.gemini/agents/)', value: 'gemini', checked: true }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one platform.';
        }
        return true;
      }
    }
  ]);

  const platforms = answers.platforms;
  let totalRemoved = 0;

  for (const platform of platforms) {
    if (platform === 'claude') {
      const removed = await uninstallFromClaude();
      totalRemoved += removed;
      // Conditionally uninstall TTS hook/script for Claude if previously installed
      try {
        cp.execFileSync('node', [path.join(__dirname, 'uninstall-tts.js')], { stdio: 'inherit' });
        totalRemoved += 1;
      } catch (e) {
        console.warn('⚠️  Failed to uninstall TTS hook:', e.message);
      }
    } else if (platform === 'gemini') {
      const removed = await uninstallFromGemini();
      totalRemoved += removed;
    }
  }

  console.log(`\n🧹 Uninstall complete! Total agents removed: ${totalRemoved}`);
}

async function uninstallFromClaude() {
  console.log('\n🗑️  Uninstalling from Claude Code...');
  
  const agentsDir = path.join(os.homedir(), '.claude', 'agents');
  return uninstallAgents('claude/agents', agentsDir, 'Claude Code');
}

async function uninstallFromGemini() {
  console.log('\n🗑️  Uninstalling from Gemini CLI...');
  
  const agentsDir = path.join(os.homedir(), '.gemini', 'agents');
  return uninstallAgents('gemini-cli/agents', agentsDir, 'Gemini CLI');
}

function uninstallAgents(sourceDir, targetDir, platformName) {
  // Check if target directory exists
  if (!fs.existsSync(targetDir)) {
    console.log(`ℹ️  No ${platformName} agents directory found. Nothing to uninstall.`);
    return 0;
  }

  // Get all .md files from the source directory
  const currentDir = process.cwd();
  const sourceAgentsDir = path.join(currentDir, sourceDir);

  // Check if source directory exists
  if (!fs.existsSync(sourceAgentsDir)) {
    console.error(`❌ Source directory ${sourceDir} not found`);
    return 0;
  }

  const mdFiles = fs.readdirSync(sourceAgentsDir)
    .filter(file => file.endsWith('.md'))
    .sort();

  if (mdFiles.length === 0) {
    console.error(`❌ No agent .md files found in ${sourceDir} directory`);
    return 0;
  }

  // Remove each corresponding .md file from the agents directory
  let removedCount = 0;
  const removedAgents = [];

  mdFiles.forEach(file => {
    try {
      const targetPath = path.join(targetDir, file);

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
    console.log(`\n✅ Successfully removed ${removedCount} MBTI coding agents from ${targetDir}`);
    console.log(`\nAgents removed from ${platformName}:`);
    removedAgents.forEach(agent => {
      console.log(`  • ${agent}`);
    });
  } else {
    console.log(`\nℹ️  No agents were removed from ${platformName}.`);
  }

  return removedCount;
}

// Run the main function
main().catch(error => {
  console.error('❌ Uninstall failed:', error.message);
  process.exit(1);
});