#!/usr/bin/env bash
# Runs ON THE SERVER after a deploy + pm2 reload.
# Confirms the app serves AND that every JS chunk the homepage HTML references is
# actually being served — i.e. the .next build on disk is internally consistent.
# This catches the class of bug where the HTML references chunk hashes that aren't
# on disk (browser 404s the JS -> React never hydrates -> sections render blank).
set -u

BASE="http://127.0.0.1:3000"

# 1) Wait for the app to come back up after the graceful reload.
up=0
for _ in $(seq 1 30); do
  if curl -sf -o /dev/null "$BASE/"; then up=1; break; fi
  sleep 2
done
if [ "$up" != 1 ]; then
  echo "FAIL: app did not respond on $BASE/ after reload"
  exit 1
fi

# 2) Fetch the homepage HTML and check every referenced /_next/static/*.js chunk.
html=$(curl -s "$BASE/")
if [ -z "$html" ]; then
  echo "FAIL: empty HTML from $BASE/"
  exit 1
fi

missing=0
checked=0
for chunk in $(printf '%s' "$html" | grep -oE '/_next/static/[^"]+\.js' | sort -u); do
  checked=$((checked + 1))
  if curl -sf -o /dev/null "$BASE$chunk"; then
    echo "  ok:      $chunk"
  else
    echo "  MISSING: $chunk"
    missing=$((missing + 1))
  fi
done

if [ "$checked" = 0 ]; then
  echo "FAIL: homepage referenced no JS chunks (unexpected)"
  exit 1
fi
if [ "$missing" != 0 ]; then
  echo "FAIL: $missing referenced JS chunk(s) are not being served — inconsistent .next"
  exit 1
fi

echo "OK: app serves and all $checked referenced JS chunks resolve"
