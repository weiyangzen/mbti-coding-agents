#!/bin/bash

# statusline.js 卸载脚本
# 这个脚本会从 Claude Code 配置中移除 statusline.js 并删除文件

CLAUDE_DIR="$HOME/.claude"
TARGET_JS="$CLAUDE_DIR/statusline.js"
CLAUDE_CONFIG="$CLAUDE_DIR/settings.json"

echo "🗑️  Uninstalling statusline.js..."

# 检查 Claude 配置文件是否存在
if [ ! -f "$CLAUDE_CONFIG" ]; then
    echo "❌ Error: Claude config file not found at $CLAUDE_CONFIG"
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

// 移除 statusLine 配置
if (config.statusLine) {
    delete config.statusLine;
    console.log('✅ statusLine configuration removed');
} else {
    console.log('ℹ️  No statusLine configuration found');
}

fs.writeFileSync('$TEMP_CONFIG', JSON.stringify(config, null, 2));
console.log('✅ Configuration updated successfully');
"

# 如果 Node.js 成功执行，替换配置文件
if [ $? -eq 0 ]; then
    mv "$TEMP_CONFIG" "$CLAUDE_CONFIG"
    
    # 删除 statusline.js 文件
    if [ -f "$TARGET_JS" ]; then
        rm "$TARGET_JS"
        echo "🗑️  Removed $TARGET_JS"
    fi
    
    echo "✅ statusline.js uninstalled successfully!"
    echo "📍 Config updated: $CLAUDE_CONFIG"
    echo "🔄 Please restart Claude Code to see the changes."
    echo ""
    echo "💡 Tip: You can always reinstall using: ./install-statusline.sh"
else
    echo "❌ Error updating configuration"
    rm -f "$TEMP_CONFIG"
    exit 1
fi