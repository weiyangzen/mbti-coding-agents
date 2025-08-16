#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

async function uninstallStatusLine() {
  console.log('🗑️  Uninstalling Status Line from Claude Code...\n');

  const homeDir = os.homedir();
  const claudeDir = path.join(homeDir, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');
  const statuslinePath = path.join(claudeDir, 'statusline.py');

  let removedCount = 0;

  // Remove statusline.py
  if (fs.existsSync(statuslinePath)) {
    try {
      fs.unlinkSync(statuslinePath);
      console.log(`✅ Removed ${statuslinePath}`);
      removedCount++;
    } catch (error) {
      console.error(`⚠️  Failed to remove statusline.py:`, error.message);
    }
  } else {
    console.log(`ℹ️  statusline.py not found at ${statuslinePath}`);
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

  if (removedCount > 0) {
    console.log(`\n🎉 Status Line uninstalled successfully!`);
  } else {
    console.log(`\nℹ️  No Status Line components found to uninstall.`);
  }
}

// Run the uninstall function
uninstallStatusLine().catch(error => {
  console.error('❌ Uninstallation failed:', error.message);
  process.exit(1);
});