#!/usr/bin/env bash
set -e

echo "Stopping any Node process on port 3000..."
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null || true

echo "Starting server..."
cd "$(dirname "$0")/../src"
npx ts-node --project tsconfig.server.json server.ts &
SERVER_PID=$!

echo "Waiting for server to be ready..."
until curl -s -o /dev/null http://localhost:3000/tables; do
    sleep 1
done

echo ""
echo "Server is running at http://localhost:3000"

# Open browser (works on macOS and most Linux desktops)
if command -v open &>/dev/null; then
    open http://localhost:3000/TableExplorer.html
elif command -v xdg-open &>/dev/null; then
    xdg-open http://localhost:3000/TableExplorer.html
fi

echo "Press Ctrl+C to stop the server."
wait $SERVER_PID
