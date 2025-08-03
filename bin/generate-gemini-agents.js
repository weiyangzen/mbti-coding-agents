#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Source and target directories
const sourceDir = path.join(process.cwd(), 'claude', 'agents');
const targetDir = path.join(process.cwd(), 'gemini-cli', 'agents');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error('❌ Source directory claude/agents/ not found');
  process.exit(1);
}

// Get all .md files from source
const mdFiles = fs.readdirSync(sourceDir)
  .filter(file => file.endsWith('.md'))
  .sort();

if (mdFiles.length === 0) {
  console.error('❌ No .md files found in claude/agents/');
  process.exit(1);
}

let generatedCount = 0;

mdFiles.forEach(file => {
  try {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    let content = fs.readFileSync(sourcePath, 'utf8');
    
    // Remove the model line from frontmatter
    content = content.replace(/^model: opus\n/m, '');
    
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(`✅ Generated ${file} for gemini-cli`);
    generatedCount++;
  } catch (error) {
    console.error(`❌ Failed to generate ${file}:`, error.message);
  }
});

console.log(`\n🎉 Successfully generated ${generatedCount} agent files for gemini-cli`);