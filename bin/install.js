#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const cp = require('child_process');

async function main() {
  console.log('🤖 MBTI Coding Agents Installer\n');

  // Ask user which platforms and components to install for
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Select platforms to install for:',
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
      message: 'Select components to install:',
      choices: [
        { name: 'MBTI Agents (16 specialized coding agents)', value: 'agents', checked: true },
        { name: 'Commands (Squad, Battle, My-Coding-MBTI)', value: 'commands', checked: true },
        { name: 'Status Line (Show costs D/W/M in Claude Code)', value: 'statusline', checked: true },
        { name: 'Output Styles (16 MBTI communication styles)', value: 'output-styles', checked: true },
        { name: 'Claude TTS (MiniMax summarize via Gemini)', value: 'claude-tts', checked: false }
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
  let totalInstalled = 0;

  for (const platform of platforms) {
    if (platform === 'claude') {
      if (components.includes('agents')) {
        const installed = await installForClaude();
        totalInstalled += installed;
      }
      if (components.includes('commands')) {
        const installed = await installCommands('claude');
        totalInstalled += installed;
      }
      if (components.includes('statusline')) {
        const installed = await installStatusLine();
        totalInstalled += installed;
      }
      if (components.includes('output-styles')) {
        const installed = await installOutputStyles();
        totalInstalled += installed;
      }
      // Conditionally install TTS hook/script for Claude when selected
      if (components.includes('claude-tts')) {
        try {
          cp.execFileSync('node', [path.join(__dirname, 'install-tts.js')], { stdio: 'inherit' });
          totalInstalled += 1;
        } catch (e) {
          console.warn('⚠️  Failed to install TTS hook:', e.message);
        }
      }
    } else if (platform === 'gemini') {
      if (components.includes('agents')) {
        const installed = await installForGemini();
        totalInstalled += installed;
      }
      if (components.includes('commands')) {
        const installed = await installCommands('gemini');
        totalInstalled += installed;
      }
    }
  }

  console.log(`\n🎉 Installation complete! Total items installed: ${totalInstalled}`);
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

async function installCommands(platform) {
  const platformName = platform === 'claude' ? 'Claude Code' : 'Gemini CLI';
  console.log(`\n🚀 Installing Commands for ${platformName}...`);

  const homeDir = os.homedir();
  const commandsDir = path.join(homeDir, `.${platform}`, 'commands');

  // Ensure the commands directory exists
  if (!fs.existsSync(commandsDir)) {
    fs.mkdirSync(commandsDir, { recursive: true });
  }

  const currentDir = process.cwd();
  const sourceCommandsDir = path.join(currentDir, 'claude', 'commands');

  // Check if source directory exists
  if (!fs.existsSync(sourceCommandsDir)) {
    console.error(`❌ Source directory claude/commands not found`);
    return 0;
  }

  const mdFiles = fs.readdirSync(sourceCommandsDir)
    .filter(file => file.endsWith('.md'))
    .sort();

  if (mdFiles.length === 0) {
    console.error(`❌ No command .md files found in claude/commands directory`);
    return 0;
  }

  // Copy each .md file to the commands directory
  let installedCount = 0;
  const installedCommands = [];

  mdFiles.forEach(file => {
    try {
      const sourcePath = path.join(sourceCommandsDir, file);
      const targetPath = path.join(commandsDir, file);

      // Copy the file
      fs.copyFileSync(sourcePath, targetPath);

      // Extract command name from filename (remove .md extension)
      const commandName = path.basename(file, '.md');
      installedCommands.push(commandName);
      installedCount++;

      console.log(`🚀 Installed: ${file}`);
    } catch (error) {
      console.error(`❌ Failed to install ${file}:`, error.message);
    }
  });

  console.log(`\n✅ Successfully installed ${installedCount} commands to ${commandsDir}`);
  console.log(`   Commands available: /${installedCommands.join(', /')}`);

  return installedCount;
}

async function installStatusLine() {
  console.log('\n📊 Installing Status Line for Claude Code...');

  const homeDir = os.homedir();
  const claudeDir = path.join(homeDir, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');
  const statuslinePath = path.join(claudeDir, 'statusline.js');

  // Ensure .claude directory exists
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // Check if ccusage is installed
  console.log('   Checking for ccusage dependency...');
  try {
    cp.execSync('which ccusage', { stdio: 'ignore' });
    console.log('   ✅ ccusage is already installed');
  } catch (e) {
    console.log('   📦 ccusage not found, installing it now...');
    try {
      cp.execSync('npm install -g ccusage', { stdio: 'inherit' });
      console.log('   ✅ ccusage installed successfully');
    } catch (installError) {
      console.warn('   ⚠️  Failed to install ccusage automatically');
      console.warn('   Please install manually: npm install -g ccusage');
      console.warn('   Status line will show $0.00 costs without ccusage');
    }
  }

  // Copy the statusline.js script
  const statuslineSource = path.join(__dirname, '..', 'claude', 'statusline.js');
  
  // Check if source exists
  if (!fs.existsSync(statuslineSource)) {
    console.error(`❌ Status line source not found at ${statuslineSource}`);
    return 0;
  }

  try {
    // Copy statusline.js to .claude directory
    fs.copyFileSync(statuslineSource, statuslinePath);
    console.log(`✅ Copied statusline.js to ${statuslinePath}`);

    // Make it executable
    try {
      fs.chmodSync(statuslinePath, '755');
    } catch (e) {
      console.warn('⚠️  Could not make statusline.js executable, you may need to run: chmod +x ~/.claude/statusline.js');
    }

    // Update settings.json with error handling
    let settings = {};
    if (fs.existsSync(settingsPath)) {
      try {
        const content = fs.readFileSync(settingsPath, 'utf-8');
        settings = JSON.parse(content);
      } catch (e) {
        console.warn('⚠️  Could not parse existing settings.json, creating new one');
        settings = {};
      }
    }

    // Add or update statusLine configuration
    settings.statusLine = {
      type: 'command',
      command: statuslinePath
    };

    // Write updated settings
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    console.log(`✅ Updated settings.json with statusLine configuration`);
    console.log(`   Status line will show: Project | Model | Context | D/W/M costs`);
    
    return 1;
  } catch (error) {
    console.error(`❌ Failed to install Status Line:`, error.message);
    console.error(`   You can manually copy ${statuslineSource} to ${statuslinePath}`);
    return 0;
  }
}

async function installOutputStyles() {
  console.log('\n🎨 Installing Output Styles for Claude Code...');

  const homeDir = os.homedir();
  const outputStylesDir = path.join(homeDir, '.claude', 'output-styles');

  // Ensure the output-styles directory exists
  if (!fs.existsSync(outputStylesDir)) {
    fs.mkdirSync(outputStylesDir, { recursive: true });
  }

  const currentDir = process.cwd();
  const sourceOutputStylesDir = path.join(currentDir, 'claude', 'output-styles');

  // Check if source directory exists
  if (!fs.existsSync(sourceOutputStylesDir)) {
    console.error(`❌ Source directory claude/output-styles not found`);
    return 0;
  }

  const mdFiles = fs.readdirSync(sourceOutputStylesDir)
    .filter(file => file.endsWith('.md'))
    .sort();

  if (mdFiles.length === 0) {
    console.error(`❌ No output style .md files found in claude/output-styles directory`);
    return 0;
  }

  // Copy each .md file to the output-styles directory
  let installedCount = 0;
  const installedStyles = [];

  mdFiles.forEach(file => {
    try {
      const sourcePath = path.join(sourceOutputStylesDir, file);
      const targetPath = path.join(outputStylesDir, file);

      // Copy the file
      fs.copyFileSync(sourcePath, targetPath);

      // Extract style name from filename (remove .md extension)
      const styleName = path.basename(file, '.md');
      installedStyles.push(styleName);
      installedCount++;

      console.log(`🎨 Installed: ${file}`);
    } catch (error) {
      console.error(`❌ Failed to install ${file}:`, error.message);
    }
  });

  console.log(`\n✅ Successfully installed ${installedCount} MBTI output styles to ${outputStylesDir}`);
  console.log(`   These styles provide personality-tuned communication patterns for Claude Code`);

  console.log(`\nOutput styles installed:`);
  installedStyles.forEach(style => {
    console.log(`  • ${style}`);
  });

  return installedCount;
}

// Run the main function
main().catch(error => {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
});