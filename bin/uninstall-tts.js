#!/usr/bin/env node

/**
 * Uninstall Claude Code TTS PostToolUse hook and JS script.
 * - Removes our command from ~/.claude/settings.json PostToolUse
 * - Removes ~/.local/bin/claude-tts-minimax.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

function main() {
  const home = os.homedir();

  // 1) Update ~/.claude/settings.json (remove our hook)
  const settingsPath = path.join(home, '.claude', 'settings.json');
  if (fs.existsSync(settingsPath)) {
    try {
      const raw = fs.readFileSync(settingsPath, 'utf8');
      const settings = JSON.parse(raw);

      if (settings && settings.hooks && Array.isArray(settings.hooks.PostToolUse)) {
        settings.hooks.PostToolUse = settings.hooks.PostToolUse.map(block => {
          if (!block || typeof block !== 'object') return block;
          const hooks = Array.isArray(block.hooks) ? block.hooks : [];
          const filtered = hooks.filter(h => !(h && h.type === 'command' && typeof h.command === 'string' && /claude-tts-minimax\.(js|py|sh)/.test(h.command)));
          return { ...block, hooks: filtered };
        });
      }

      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf8');
      console.log('🔧 Removed TTS PostToolUse hook from', settingsPath);
    } catch (e) {
      console.warn('⚠️  Failed to update settings.json:', e.message);
    }
  } else {
    console.log('ℹ️  No ~/.claude/settings.json found. Skipping settings update.');
  }

  // 2) Remove script file
  const scriptPath = path.join(home, '.local', 'bin', 'claude-tts-minimax.js');
  try {
    if (fs.existsSync(scriptPath)) {
      fs.unlinkSync(scriptPath);
      console.log('🗑️  Removed', scriptPath);
    } else {
      console.log('ℹ️  Script not found, skipping:', scriptPath);
    }
  } catch (e) {
    console.warn('⚠️  Failed to remove script:', e.message);
  }

  console.log('\n✅ Uninstall complete.');
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('❌ Failed:', e.message); process.exit(1); }
}

