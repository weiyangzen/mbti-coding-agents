#!/usr/bin/env node

/**
 * Install Claude Code TTS PostToolUse hook and JS script.
 * - Copies tts/claude-tts-minimax.js to ~/.local/bin/claude-tts-minimax.js (chmod +x)
 * - Adds a PostToolUse hook to ~/.claude/settings.json to invoke the script via Node
 * - Does not include any API keys or account info
 * - English only; Minimax default voice: Grinch
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function deepGet(obj, pathArr, defVal) {
  return pathArr.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj) ?? defVal;
}

function ensurePostToolUseHook(settings, cmd) {
  settings.hooks = settings.hooks || {};
  const hooks = settings.hooks;

  // Prepare our PTU entry
  const ourHook = { type: 'command', command: cmd };
  const ourMatcher = '*';

  // Ensure hooks.PostToolUse is an array
  if (!Array.isArray(hooks.PostToolUse)) hooks.PostToolUse = [];

  // Try to find a block with matcher "*"
  let block = hooks.PostToolUse.find(b => b && (b.matcher === ourMatcher || b.matcher === undefined));
  if (!block) {
    block = { matcher: ourMatcher, hooks: [] };
    hooks.PostToolUse.unshift(block);
  }

  if (!Array.isArray(block.hooks)) block.hooks = [];

  // Remove any legacy python minimax TTS command to avoid duplicates
  block.hooks = block.hooks.filter(h => {
    if (!h || typeof h !== 'object') return true;
    if (h.type !== 'command' || typeof h.command !== 'string') return true;
    return !/claude-tts-minimax\.(py|sh)/.test(h.command);
  });

  // Add our command if not present
  const exists = block.hooks.some(h => h.type === 'command' && h.command === cmd);
  if (!exists) block.hooks.unshift(ourHook);
}

function main() {
  const home = os.homedir();
  const localBin = path.join(home, '.local', 'bin');
  ensureDir(localBin);

  // 1) Copy JS script
  const srcScript = path.join(process.cwd(), 'tts', 'claude-tts-minimax.js');
  const dstScript = path.join(localBin, 'claude-tts-minimax.js');
  if (!fs.existsSync(srcScript)) {
    console.error('❌ Source script not found:', srcScript);
    process.exit(1);
  }
  fs.copyFileSync(srcScript, dstScript);
  try { fs.chmodSync(dstScript, 0o755); } catch {}
  console.log('✅ Installed TTS script to', dstScript);

  // 2) Update ~/.claude/settings.json
  const claudeDir = path.join(home, '.claude');
  ensureDir(claudeDir);
  const settingsPath = path.join(claudeDir, 'settings.json');

  let settings = {};
  if (fs.existsSync(settingsPath)) {
    // Backup
    const backupPath = settingsPath + '.bak.' + Date.now();
    fs.copyFileSync(settingsPath, backupPath);
    console.log('🗂️  Backed up settings to', backupPath);

    try {
      const raw = fs.readFileSync(settingsPath, 'utf8');
      settings = JSON.parse(raw);
    } catch (e) {
      console.warn('⚠️  Existing settings.json is invalid JSON; starting from empty.');
      settings = {};
    }
  }

  const nodeCmd = `node ${dstScript}`;
  ensurePostToolUseHook(settings, nodeCmd);

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf8');
  console.log('🔧 Updated PostToolUse hook in', settingsPath);

  // 3) Ensure quick config exists
  const cfgPath = path.join(claudeDir, 'tts.config.json');
  if (!fs.existsSync(cfgPath)) {
    const sample = {
      minimax: { url: 'https://api.minimax.io/v1/t2a_v2', api_key: '', group_id: '' },
      gemini: { url: '', api_key: '', model: 'gemini-2.5-flash', summary_language: 'en' }
    };
    fs.writeFileSync(cfgPath, JSON.stringify(sample, null, 2) + '\n', 'utf8');
    console.log('📝 Created quick config at', cfgPath);
  } else {
    console.log('📝 Quick config already exists at', cfgPath);
  }

  console.log('\n🎉 Done. Notes:');
  console.log('- Voice: Minimax Grinch (default)');
  console.log('- Configure ~/.claude/tts.config.json (minimax.url/api_key/group_id)');
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌ Failed:', e.message); process.exit(1); }
}

