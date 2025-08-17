#!/bin/bash

# statusline.js 安装脚本
# 这个脚本会将 statusline.js 安装到 ~/.claude/ 并集成到 Claude Code 配置中

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_JS="$SCRIPT_DIR/statusline.js"
CLAUDE_DIR="$HOME/.claude"
TARGET_JS="$CLAUDE_DIR/statusline.js"
CLAUDE_CONFIG="$CLAUDE_DIR/settings.json"

echo "🚀 Installing statusline.js..."

# 检查源文件是否存在
if [ ! -f "$SOURCE_JS" ]; then
    echo "❌ Error: statusline.js not found in $SCRIPT_DIR"
    exit 1
fi

# 确保 ~/.claude 目录存在
mkdir -p "$CLAUDE_DIR"

# 复制 statusline.js 到 ~/.claude/
echo "📁 Copying statusline.js to $TARGET_JS"
cp "$SOURCE_JS" "$TARGET_JS"

# 确保目标文件可执行
chmod +x "$TARGET_JS"

# 检查 Claude 配置文件是否存在
if [ ! -f "$CLAUDE_CONFIG" ]; then
    echo "❌ Error: Claude config file not found at $CLAUDE_CONFIG"
    echo "Please make sure Claude Code is properly installed."
    exit 1
fi

# 备份现有配置
echo "📋 Backing up existing config..."
cp "$CLAUDE_CONFIG" "$CLAUDE_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"

# 创建临时文件来修改配置
TEMP_CONFIG=$(mktemp)

# 使用 Node.js 来修改 JSON 配置
node -e "
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('$CLAUDE_CONFIG', 'utf8'));

// 更新 statusLine 配置
config.statusLine = {
  type: 'command',
  command: '$TARGET_JS'
};

fs.writeFileSync('$TEMP_CONFIG', JSON.stringify(config, null, 2));
console.log('✅ Configuration updated successfully');
"

# 如果 Node.js 成功执行，替换配置文件
if [ $? -eq 0 ]; then
    mv "$TEMP_CONFIG" "$CLAUDE_CONFIG"
    echo "✅ statusline.js installed successfully!"
    echo "📍 Status line script: $TARGET_JS"
    echo "📍 Config updated: $CLAUDE_CONFIG"
    echo "🔄 Please restart Claude Code to see the changes."
else
    echo "❌ Error updating configuration"
    rm -f "$TEMP_CONFIG"
    exit 1
fi