#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');

async function main() {
  console.log('🤖 MBTI Coding Agents Installer\n');
  
  // Ask user which platforms to install for
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Select platforms to install agents for:',
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
  let totalInstalled = 0;

  for (const platform of platforms) {
    if (platform === 'claude') {
      const installed = await installForClaude();
      totalInstalled += installed;
    } else if (platform === 'gemini') {
      const installed = await installForGemini();
      totalInstalled += installed;
    }
  }

  console.log(`\n🎉 Installation complete! Total agents installed: ${totalInstalled}`);
}

async function installForClaude() {
  console.log('\n📦 Installing for Claude Code...');
  
  const agentsDir = path.join(os.homedir(), '.claude', 'agents');
  
  // Ensure the agents directory exists
  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true });
  }

  return installAgents('claude/agents', agentsDir, 'Claude Code');
}

async function installForGemini() {
  console.log('\n📦 Installing for Gemini CLI...');
  
  const agentsDir = path.join(os.homedir(), '.gemini', 'agents');
  
  // Ensure the agents directory exists
  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true });
  }

  return installAgents('gemini-cli/agents', agentsDir, 'Gemini CLI');
}

function installAgents(sourceDir, targetDir, platformName) {

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

  // Copy each .md file to the agents directory
  let installedCount = 0;
  const installedAgents = [];

  mdFiles.forEach(file => {
    try {
      const sourcePath = path.join(sourceAgentsDir, file);
      const targetPath = path.join(targetDir, file);
      
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

  console.log(`\n✅ Successfully installed ${installedCount} MBTI coding agents to ${targetDir}`);
  console.log(`\nAgents installed for ${platformName}:`);
  installedAgents.forEach(agent => {
    console.log(`  • ${agent}`);
  });

  return installedCount;
}

// Run the main function
main().catch(error => {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
});