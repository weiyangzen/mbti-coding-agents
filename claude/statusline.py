#!/usr/bin/env python3
import json
import sys
import os
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

def get_context_usage(context):
    """Get context usage percentage from Claude"""
    try:
        # Check if context contains token information
        if 'context_tokens_used' in context and 'context_tokens_limit' in context:
            used = context['context_tokens_used']
            limit = context['context_tokens_limit']
            if limit > 0:
                percentage = (used / limit) * 100
                return f"{percentage:.0f}%"
        
        # Check if context has tokens_until_compact (inverse calculation)
        elif 'tokens_until_compact' in context and 'context_tokens_limit' in context:
            remaining = context['tokens_until_compact']
            limit = context['context_tokens_limit']
            if limit > 0:
                percentage = ((limit - remaining) / limit) * 100
                return f"{percentage:.0f}%"
        
        # Check if context directly provides percentage
        elif 'context_percentage' in context:
            return f"{context['context_percentage']:.0f}%"
        
        # Check for alternative field names
        elif 'context' in context and isinstance(context['context'], dict):
            ctx = context['context']
            if 'usage' in ctx:
                return f"{ctx['usage']:.0f}%"
            elif 'percentage' in ctx:
                return f"{ctx['percentage']:.0f}%"
        
        # Try to estimate based on Claude's internal calculation
        # This mimics the obfuscated fS() function logic
        return estimate_context_from_session(context)
    except Exception as e:
        return "N/A"

def estimate_context_from_session(context):
    """
    Estimate context usage based on Claude's internal calculation.
    Reverse engineered from obfuscated code: fS(tokenUsage) function
    
    Claude displays: "Context left until auto-compact: X%" (percent_left)
    We display: percentage USED = 100 - percent_left
    """
    try:
        # Constants from obfuscated code
        YE8 = 13000  # Auto-compact threshold offset (triggers at 187k out of 200k)
        model_limits = {
            'opus-4': 200000,
            'opus-4-1': 200000,
            'sonnet-4': 200000,
            'haiku': 200000,
            'default': 200000
        }
        
        # Get model name
        model_name = context.get('model', {}).get('display_name', 'default').lower()
        
        # Find matching limit
        max_tokens = model_limits.get('default')
        for key in model_limits:
            if key in model_name:
                max_tokens = model_limits[key]
                break
        
        # Try to read from transcript file if available
        if 'transcript_path' in context:
            try:
                transcript_path = context['transcript_path']
                if os.path.exists(transcript_path):
                    # Read JSONL file and count messages/estimate tokens
                    message_count = 0
                    total_chars = 0
                    with open(transcript_path, 'r') as f:
                        for line in f:
                            if line.strip():
                                message_count += 1
                                # Parse JSON line to get content length
                                try:
                                    msg = json.loads(line)
                                    # Count characters in content
                                    if isinstance(msg, dict):
                                        content = str(msg.get('content', ''))
                                        total_chars += len(content)
                                except:
                                    # Fallback: estimate 100 chars per message
                                    total_chars += 100
                    
                    # Estimate tokens (roughly 4 chars per token)
                    token_usage = total_chars // 4
                    
                    # Alternative: use message count if char count seems wrong
                    if token_usage < message_count * 10:
                        # Average message is ~100 tokens
                        token_usage = message_count * 100
                        
                else:
                    # Transcript file doesn't exist, fall back to other methods
                    token_usage = None
            except Exception as e:
                # Error reading transcript, fall back to other methods
                token_usage = None
        else:
            token_usage = None
        
        # Fall back to other estimation methods if transcript reading failed
        if token_usage is None:
            # Check if we have session data to estimate from
            if 'session_tokens' in context:
                token_usage = context['session_tokens']
            elif 'message_count' in context:
                # Rough estimate: average message = ~100 tokens
                token_usage = context['message_count'] * 100
            elif 'conversation_length' in context:
                # Even rougher estimate based on character count
                token_usage = context['conversation_length'] // 4  # ~4 chars per token
            else:
                # No data available for estimation
                return "N/A"
        
        # Calculate percentage using Claude's formula
        # Both context_used and context_left should use the same threshold (187k)
        threshold = max_tokens - YE8  # 200000 - 13000 = 187000
        
        # Calculate context_used based on the same threshold Claude uses
        # This ensures our percentage matches Claude's internal calculation
        percent_used = round((token_usage / threshold) * 100)
        
        # Ensure it doesn't exceed 100%
        percent_used = min(100, max(0, percent_used))
        
        # Return the percentage USED
        return f"{percent_used:.0f}%"
        
    except:
        return "N/A"

def get_ccusage_costs():
    """Get ccusage costs for today/week/month"""
    try:
        import re
        from datetime import datetime, timedelta
        
        # Get current date
        today = datetime.now()
        today_str = today.strftime('%Y-%m-%d')
        
        # Calculate date ranges as per user's specification
        # ws = today - 6 days (for last 7 days including today)
        # ms = today - 29 days (for last 30 days including today)
        week_start = (today - timedelta(days=6)).strftime('%Y-%m-%d')
        month_start = (today - timedelta(days=29)).strftime('%Y-%m-%d')
        
        # Run ccusage daily command to get detailed daily costs
        result = subprocess.run(['ccusage', 'daily', '--limit', '30'], 
                              capture_output=True, text=True, timeout=5)
        
        if result.returncode == 0:
            output = result.stdout
            
            # Initialize costs
            daily_cost = 0.00
            weekly_cost = 0.00
            monthly_cost = 0.00
            
            # Parse the table output - dates are split across two lines
            # Year on first line, month-day on second line
            lines = output.split('\n')
            current_year = None
            
            for i, line in enumerate(lines):
                # Strip ANSI color codes for easier parsing
                clean_line = re.sub(r'\x1b\[[0-9;]*m', '', line)
                
                # First check if this line has a year (4 digits at start)
                year_match = re.search(r'│\s*(\d{4})\s', clean_line)
                if year_match:
                    current_year = year_match.group(1)
                    # Check if there's a cost on this line
                    cost_match = re.search(r'\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\s*│', clean_line)
                    if cost_match:
                        cost_str = cost_match.group(1).replace(',', '')
                        cost = float(cost_str)
                        
                        # Now check the next line for month-day
                        if i + 1 < len(lines):
                            next_line = lines[i + 1]
                            clean_next = re.sub(r'\x1b\[[0-9;]*m', '', next_line)
                            date_match = re.search(r'│\s*(\d{2})-(\d{2})\s', clean_next)
                            if date_match and current_year:
                                month = date_match.group(1)
                                day = date_match.group(2)
                                date_str = f"{current_year}-{month}-{day}"
                                
                                # Check if this date is today
                                if date_str == today_str:
                                    daily_cost = cost
                                
                                # Check if this date is within the last 7 days
                                if date_str >= week_start and date_str <= today_str:
                                    weekly_cost += cost
                                
                                # Check if this date is within the last 30 days
                                if date_str >= month_start and date_str <= today_str:
                                    monthly_cost += cost
            
            return f"D:${daily_cost:.2f} W:${weekly_cost:.2f} M:${monthly_cost:.2f}"
        
    except Exception as e:
        # Log error for debugging
        import sys
        print(f"Error getting ccusage costs: {e}", file=sys.stderr)
    
    return "D:$0.00 W:$0.00 M:$0.00"

def generate_status_line(context):
    """Generate the status line with all requested information"""
    # Extract information from context
    model = context.get('model', {}).get('display_name', 'Unknown')
    current_dir = context.get('workspace', {}).get('current_directory', os.getcwd())
    project_name = os.path.basename(current_dir) if current_dir else os.path.basename(os.getcwd())
    
    # Get context usage
    context_usage = get_context_usage(context)
    
    # Get ccusage costs
    costs = get_ccusage_costs()
    
    # Format the status line
    # Using emojis for visual separation
    status_line = f"📁 {project_name} | 🤖 {model} | 📊 {context_usage} | 💰 {costs}"
    
    return status_line

if __name__ == "__main__":
    try:
        # Read JSON input from command line argument
        if len(sys.argv) > 1:
            context = json.loads(sys.argv[1])
        else:
            # Read from stdin if no argument provided
            context = json.load(sys.stdin)
        
        # Generate and print the status line
        print(generate_status_line(context))
    except Exception as e:
        # Fallback status line if something goes wrong
        print(f"Status Line Error: {str(e)[:50]}")