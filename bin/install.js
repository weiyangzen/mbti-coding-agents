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
        { name: 'Squad Command (Interactive team formation)', value: 'squad', checked: true },
        { name: 'Status Line (Show costs D/W/M in Claude Code)', value: 'statusline', checked: true },
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
      if (components.includes('squad')) {
        const installed = await installSquadCommand('claude');
        totalInstalled += installed;
      }
      if (components.includes('statusline')) {
        const installed = await installStatusLine();
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
      if (components.includes('squad')) {
        const installed = await installSquadCommand('gemini');
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

async function installSquadCommand(platform) {
  const platformName = platform === 'claude' ? 'Claude Code' : 'Gemini CLI';
  console.log(`\n🚀 Installing Squad Command for ${platformName}...`);

  const homeDir = os.homedir();
  const commandsDir = path.join(homeDir, `.${platform}`, 'commands');

  // Ensure the commands directory exists
  if (!fs.existsSync(commandsDir)) {
    fs.mkdirSync(commandsDir, { recursive: true });
  }

  // Path to the squad.md file - use the new enhanced version from the project
  const squadSourcePath = path.join(__dirname, '..', 'claude', 'commands', 'squad.md');
  const squadTargetPath = path.join(commandsDir, 'squad.md');

  // Check if source file exists
  if (!fs.existsSync(squadSourcePath)) {
    console.log(`⚠️  Squad command source not found at ${squadSourcePath}`);
    console.log('   Creating default squad command...');

    // Create a default squad.md if it doesn't exist
    const defaultSquadContent = `---
description: Interactive MBTI agent squad formation system with continuous table selection
argument-hint: [task description]
allowed-tools: *
---

# 🤖 MBTI Squad Formation System

## Interactive Mode Selection

$IF($ARGUMENTS == "" || $ARGUMENTS == "help")
**请选择你的团队组建模式：**

| 模式 | 图标 | 描述 | 适用场景 |
|------|------|------|----------|
| **1. Smart Flash** | ⚡ | AI自动分析任务并组建最优团队 | 快速开发、标准任务、日常编码 |
| **2. Interactive Review** | 🎯 | 先看AI推荐，再决定是否自定义 | 复杂项目、特殊需求、团队学习 |
| **3. Manual Selection** | 🔧 | 手动选择团队成员 | 已知需求、特定偏好、教学演示 |
| **4. Agent Explorer** | 📊 | 浏览所有可用代理信息 | 了解代理、学习MBTI、研究选择 |

**Please enter number to select mode:**

选择模式后，可随时：
- 输入 0 返回主菜单
- Enter number to switch to other modes
- 继续与当前模式交互

$ENDIF

$IF($ARGUMENTS == "1")
# ⚡ Smart Flash 智能选择模式

请描述你的开发任务，我将立即为你组建最优团队。

**请输入任务描述：**

示例：
- "构建一个React仪表板并集成API"
- "修复生产环境的性能问题"
- "设计用户注册登录系统"

使用格式：\`/squad 1 [你的任务描述]\`
$ENDIF

$IF($ARGUMENTS == "2")
# 🎯 Interactive Review 交互式审查模式

请描述你的开发任务，我将：
1. 分析任务需求并推荐最佳团队配置
2. 展示推荐的团队成员及其职责
3. 让你选择接受推荐或自定义调整

**请输入任务描述：**

示例：
- "开发电商网站的支付模块"
- "优化数据库查询性能"
- "创建移动端用户界面"

使用格式：\`/squad 2 [你的任务描述]\`
$ENDIF

$IF($ARGUMENTS ~= "^1 .+")
# ⚡ Smart Flash 团队组建

**任务：** $SUBSTRING($ARGUMENTS, 3)

I'll now analyze your task and form an optimal MBTI agent squad using Smart Flash mode - automatic intelligent selection based on algorithmic analysis.

## Smart Analysis Process
1. **Keyword Analysis**: Extract key requirements and technical patterns
2. **Dimension Scoring**: Evaluate execution, innovation, and risk-mitigation needs
3. **Agent Selection**: Choose complementary agents based on cognitive diversity
4. **Squad Optimization**: Ensure balanced team coverage

## Available MBTI Agents

**Analysts (NT):**
- INTJ Strategic Architect: System design & long-term planning
- INTP Theorist: Algorithmic analysis & theoretical problem-solving
- ENTJ Project Commander: Decisive leadership & execution optimization
- ENTP Innovation Catalyst: Breakthrough solutions & creative disruption

**Diplomats (NF):**
- INFJ Empathetic Mentor: Gentle guidance & authentic development
- INFP Creative Muse: Personal expression & unconventional approaches
- ENFJ Team Catalyst: Team cohesion & collaborative development
- ENFP Enthusiasm Engine: Creative inspiration & motivational support

**Sentinels (SJ):**
- ISTJ Standards Enforcer: Code quality standards & systematic processes
- ISFJ Code Protector: Comprehensive stability analysis & maintenance
- ESTJ Business Optimizer: Business-focused solutions & operational efficiency
- ESFJ Team Harmonizer: Team collaboration & communication optimization

**Explorers (SP):**
- ISTP Troubleshooter: Direct problem-solving & technical debugging
- ISFP Aesthetic Designer: UI/UX design with emotional resonance
- ESTP Entrepreneur: Rapid prototyping & MVP development
- ESFP Interactive Entertainer: Engaging interfaces & user delight

**Now analyzing your task and selecting optimal squad...**
$ENDIF

$IF($ARGUMENTS ~= "^2 .+")
# 🎯 Interactive Review 团队组建

**任务：** $SUBSTRING($ARGUMENTS, 3)

I'll analyze your task and provide AI-recommended squad configuration for your review and customization.

## Analysis Framework
1. **Task Decomposition**: Break down core requirements and components
2. **Dimension Assessment**: Score execution, innovation, risk-mitigation needs
3. **Agent Recommendation**: Suggest optimal team based on cognitive strengths
4. **Review Options**: Present for acceptance or customization

## Available MBTI Agents

**Analysts (NT):**
- INTJ Strategic Architect: System design & long-term planning
- INTP Theorist: Algorithmic analysis & theoretical problem-solving
- ENTJ Project Commander: Decisive leadership & execution optimization
- ENTP Innovation Catalyst: Breakthrough solutions & creative disruption

**Diplomats (NF):**
- INFJ Empathetic Mentor: Gentle guidance & authentic development
- INFP Creative Muse: Personal expression & unconventional approaches
- ENFJ Team Catalyst: Team cohesion & collaborative development
- ENFP Enthusiasm Engine: Creative inspiration & motivational support

**Sentinels (SJ):**
- ISTJ Standards Enforcer: Code quality standards & systematic processes
- ISFJ Code Protector: Comprehensive stability analysis & maintenance
- ESTJ Business Optimizer: Business-focused solutions & operational efficiency
- ESFJ Team Harmonizer: Team collaboration & communication optimization

**Explorers (SP):**
- ISTP Troubleshooter: Direct problem-solving & technical debugging
- ISFP Aesthetic Designer: UI/UX design with emotional resonance
- ESTP Entrepreneur: Rapid prototyping & MVP development
- ESFP Interactive Entertainer: Engaging interfaces & user delight

**Now generating AI recommendation for your review...**
$ENDIF`;

    // Write the default squad.md to source location
    fs.writeFileSync(squadSourcePath, defaultSquadContent);
  }

  try {
    // Copy the squad.md file
    fs.copyFileSync(squadSourcePath, squadTargetPath);
    console.log(`✅ Squad Command installed to ${squadTargetPath}`);
    console.log(`   You can now use /squad in ${platformName}`);
    return 1;
  } catch (error) {
    console.error(`❌ Failed to install Squad Command:`, error.message);
    return 0;
  }
}

async function installStatusLine() {
  console.log('\n📊 Installing Status Line for Claude Code...');

  const homeDir = os.homedir();
  const claudeDir = path.join(homeDir, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');
  const statuslinePath = path.join(claudeDir, 'statusline.py');

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

  // First, copy the statusline.py script
  const statuslineSource = path.join(__dirname, '..', 'claude', 'statusline.py');
  
  // Check if source exists, if not create it
  if (!fs.existsSync(statuslineSource)) {
    console.log('   Creating statusline.py from current version...');
    const statuslineContent = fs.readFileSync(path.join(homeDir, '.claude', 'statusline.py'), 'utf-8');
    fs.writeFileSync(statuslineSource, statuslineContent);
  }

  try {
    // Copy statusline.py to .claude directory
    fs.copyFileSync(statuslineSource, statuslinePath);
    console.log(`✅ Copied statusline.py to ${statuslinePath}`);

    // Update settings.json
    let settings = {};
    if (fs.existsSync(settingsPath)) {
      const content = fs.readFileSync(settingsPath, 'utf-8');
      try {
        settings = JSON.parse(content);
      } catch (e) {
        console.warn('⚠️  Could not parse existing settings.json, creating new one');
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
    return 0;
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
});