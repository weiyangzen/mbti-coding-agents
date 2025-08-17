#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const cp = require('child_process');

async function main() {
  console.log('🗑️  MBTI Coding Agents Uninstaller\n');
  
  // Ask user which platforms and components to uninstall
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Select platforms to uninstall from:',
      choices: [
        { name: 'Claude Code (~/.claude/)', value: 'claude', checked: true },
        { name: 'Gemini CLI (~/.gemini/)', value: 'gemini', checked: true }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one platform.';
        }
        return true;
      }
    },
    {
      type: 'checkbox',
      name: 'components',
      message: 'Select components to uninstall:',
      choices: [
        { name: 'MBTI Agents (Remove all 16 agents)', value: 'agents', checked: true },
        { name: 'Squad Command (Remove /squad command)', value: 'squad', checked: true },
        { name: 'Status Line (Remove cost display)', value: 'statusline', checked: true },
        { name: 'Output Styles (Remove 16 MBTI communication styles)', value: 'output-styles', checked: true },
        { name: 'Claude TTS (Remove TTS hooks)', value: 'claude-tts', checked: false }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one component.';
        }
        return true;
      }
    }
  ]);

  const platforms = answers.platforms;
  const components = answers.components;
  let totalRemoved = 0;

  for (const platform of platforms) {
    if (platform === 'claude') {
      if (components.includes('agents')) {
        const removed = await uninstallFromClaude();
        totalRemoved += removed;
      }
      if (components.includes('squad')) {
        const removed = await uninstallSquadCommand('claude');
        totalRemoved += removed;
      }
      if (components.includes('statusline')) {
        const removed = await uninstallStatusLine();
        totalRemoved += removed;
      }
      if (components.includes('output-styles')) {
        const removed = await uninstallOutputStyles();
        totalRemoved += removed;
      }
      if (components.includes('claude-tts')) {
        try {
          cp.execFileSync('node', [path.join(__dirname, 'uninstall-tts.js')], { stdio: 'inherit' });
          totalRemoved += 1;
        } catch (e) {
          console.warn('⚠️  Failed to uninstall TTS hook:', e.message);
        }
      }
    } else if (platform === 'gemini') {
      if (components.includes('agents')) {
        const removed = await uninstallFromGemini();
        totalRemoved += removed;
      }
      if (components.includes('squad')) {
        const removed = await uninstallSquadCommand('gemini');
        totalRemoved += removed;
      }
    }
  }

  console.log(`\n🧹 Uninstall complete! Total items removed: ${totalRemoved}`);
}

async function uninstallFromClaude() {
  console.log('\n🗑️  Uninstalling agents from Claude Code...');
  
  const agentsDir = path.join(os.homedir(), '.claude', 'agents');
  return uninstallAgents('claude/agents', agentsDir, 'Claude Code');
}

async function uninstallFromGemini() {
  console.log('\n🗑️  Uninstalling agents from Gemini CLI...');
  
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

async function uninstallSquadCommand(platform) {
  const platformName = platform === 'claude' ? 'Claude Code' : 'Gemini CLI';
  console.log(`\n🗑️  Uninstalling Squad Command from ${platformName}...`);

  const homeDir = os.homedir();
  const commandsDir = path.join(homeDir, `.${platform}`, 'commands');
  const squadPath = path.join(commandsDir, 'squad.md');

  if (fs.existsSync(squadPath)) {
    try {
      fs.unlinkSync(squadPath);
      console.log(`✅ Removed squad.md from ${commandsDir}`);
      return 1;
    } catch (error) {
      console.error(`❌ Failed to remove Squad Command:`, error.message);
      return 0;
    }
  } else {
    console.log(`ℹ️  Squad Command not found at ${squadPath}`);
    return 0;
  }
}

async function uninstallStatusLine() {
  console.log('\n🗑️  Uninstalling Status Line from Claude Code...');

  const homeDir = os.homedir();
  const claudeDir = path.join(homeDir, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');
  const statuslineJsPath = path.join(claudeDir, 'statusline.js');
  const statuslinePyPath = path.join(claudeDir, 'statusline.py'); // Also check for old .py version

  let removedCount = 0;

  // Remove statusline.js (current version)
  if (fs.existsSync(statuslineJsPath)) {
    try {
      fs.unlinkSync(statuslineJsPath);
      console.log(`✅ Removed ${statuslineJsPath}`);
      removedCount++;
    } catch (error) {
      console.error(`⚠️  Failed to remove statusline.js:`, error.message);
    }
  } else {
    console.log(`ℹ️  statusline.js not found at ${statuslineJsPath}`);
  }

  // Remove old statusline.py if exists
  if (fs.existsSync(statuslinePyPath)) {
    try {
      fs.unlinkSync(statuslinePyPath);
      console.log(`✅ Removed old ${statuslinePyPath}`);
      removedCount++;
    } catch (error) {
      console.error(`⚠️  Failed to remove old statusline.py:`, error.message);
    }
  }

  // Update settings.json to remove statusLine configuration
  if (fs.existsSync(settingsPath)) {
    try {
      const content = fs.readFileSync(settingsPath, 'utf-8');
      const settings = JSON.parse(content);

      if (settings.statusLine) {
        delete settings.statusLine;
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        console.log(`✅ Removed statusLine configuration from settings.json`);
        removedCount++;
      } else {
        console.log(`ℹ️  No statusLine configuration found in settings.json`);
      }
    } catch (error) {
      console.error(`⚠️  Failed to update settings.json:`, error.message);
    }
  }

  return removedCount;
}

async function uninstallOutputStyles() {
  console.log('\n🗑️  Uninstalling Output Styles from Claude Code...');

  const homeDir = os.homedir();
  const outputStylesDir = path.join(homeDir, '.claude', 'output-styles');

  if (!fs.existsSync(outputStylesDir)) {
    console.log(`ℹ️  Output styles directory not found at ${outputStylesDir}`);
    return 0;
  }

  let removedCount = 0;

  try {
    const files = fs.readdirSync(outputStylesDir).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      console.log(`ℹ️  No output style files found to remove`);
      return 0;
    }

    files.forEach(file => {
      const filePath = path.join(outputStylesDir, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.error(`❌ Failed to remove ${file}:`, error.message);
      }
    });

    // Remove directory if empty
    try {
      const remainingFiles = fs.readdirSync(outputStylesDir);
      if (remainingFiles.length === 0) {
        fs.rmdirSync(outputStylesDir);
        console.log(`✅ Removed empty directory: ${outputStylesDir}`);
      }
    } catch (error) {
      // Ignore errors when removing directory
      console.log(`ℹ️  Directory ${outputStylesDir} not empty, keeping it`);
    }

    console.log(`✅ Successfully removed ${removedCount} MBTI output styles`);
  } catch (error) {
    console.error(`❌ Failed to access output styles directory:`, error.message);
  }

  return removedCount;
}

// Run the main function
main().catch(error => {
  console.error('❌ Uninstall failed:', error.message);
  process.exit(1);
});