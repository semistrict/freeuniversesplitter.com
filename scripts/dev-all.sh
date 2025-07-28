#!/bin/bash

# Free Universe Splitter - Development Server Starter
# Starts all development servers in tmux panes with fixed ports

SESSION_NAME="fus-dev"

# Kill existing session if it exists
tmux has-session -t $SESSION_NAME 2>/dev/null && tmux kill-session -t $SESSION_NAME

# Create new session with first pane for main app
tmux new-session -d -s $SESSION_NAME -n main

# Split horizontally for API server
tmux split-window -h -t $SESSION_NAME:main

# Split the right pane vertically for MCP server
tmux split-window -v -t $SESSION_NAME:main.1

# Configure panes:
# Pane 0 (left): Main SvelteKit app on port 5173
tmux send-keys -t $SESSION_NAME:main.0 "cd /Users/ramon/src/freeuniversesplitter.com && npm run dev" Enter

# Pane 1 (top-right): API server on port 8787
tmux send-keys -t $SESSION_NAME:main.1 "cd /Users/ramon/src/freeuniversesplitter.com/fus_api && npm run start" Enter

# Pane 2 (bottom-right): MCP server on port 8788
tmux send-keys -t $SESSION_NAME:main.2 "cd /Users/ramon/src/freeuniversesplitter.com/fus_mcp && npm run dev" Enter

# Set pane titles
tmux select-pane -t $SESSION_NAME:main.0 -T "Main App :5173"
tmux select-pane -t $SESSION_NAME:main.1 -T "API :8787"
tmux select-pane -t $SESSION_NAME:main.2 -T "MCP :8788"

# Enable pane titles
tmux set -g pane-border-status top

# Focus on main app pane
tmux select-pane -t $SESSION_NAME:main.0

# Attach to session
tmux attach-session -t $SESSION_NAME

echo "Development servers started in tmux session '$SESSION_NAME'"
echo "  Pane 0: Main App (SvelteKit) - http://localhost:5173"
echo "  Pane 1: Quantum API - http://localhost:8787"
echo "  Pane 2: MCP Server - http://localhost:8788"
echo ""
echo "Use 'tmux attach -t $SESSION_NAME' to reconnect"
echo "Use 'tmux kill-session -t $SESSION_NAME' to stop all servers"