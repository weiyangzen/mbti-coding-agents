#!/usr/bin/env python3
import json
import sys
import os
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

def get_context_usage():
    """Get context compression usage from Claude"""
    try:
        # Try to get context usage info (this would need API access or internal info)
        # For now, returning placeholder - would need actual implementation
        return "75%"
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
    context_usage = get_context_usage()
    
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