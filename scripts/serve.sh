#!/usr/bin/env bash
# Starts the production server in the background for screenshots/e2e. Stops any previous one first.
set -euo pipefail
PORT="${PORT:-3000}"
for pid in $(pgrep -f "next[-]server" || true); do kill "$pid" 2>/dev/null || true; done
sleep 1
mkdir -p .tmp-preview
nohup npm run start -- --port "$PORT" > .tmp-preview/server.log 2>&1 &
for i in $(seq 1 30); do
  if curl -s -o /dev/null "http://127.0.0.1:$PORT/"; then echo "server up on $PORT"; exit 0; fi
  sleep 1
done
echo "server failed to start"; cat .tmp-preview/server.log; exit 1
