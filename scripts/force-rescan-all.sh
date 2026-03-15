#!/bin/bash
# force-rescan-all.sh
# Scans every stock in UNIVERSE_ALL, 2 at a time, with forced AI agent runs.
# Respects TinyFish 2-concurrent limit by waiting for each pair to finish.
#
# Usage (on EC2):  bash scripts/force-rescan-all.sh
#   Optional: bash scripts/force-rescan-all.sh ASX    (ASX stocks only)
#   Optional: bash scripts/force-rescan-all.sh US     (US stocks only)

BASE_URL="http://localhost:3085"
FILTER="${1:-ALL}"   # ALL | ASX | US
POLL_INTERVAL=10     # seconds between status polls
SCAN_TIMEOUT=240     # seconds before giving up on a single scan

# Internal auth token — must match INTERNAL_API_SECRET in ~/.env.dev
# Load from env file if not already set
if [ -z "$INTERNAL_API_SECRET" ] && [ -f ~/.env.dev ]; then
  INTERNAL_API_SECRET=$(grep '^INTERNAL_API_SECRET=' ~/.env.dev | cut -d= -f2- | tr -d '"' | tr -d "'")
fi
if [ -z "$INTERNAL_API_SECRET" ]; then
  echo "ERROR: INTERNAL_API_SECRET not set. Add it to ~/.env.dev"
  exit 1
fi

# ── Full universe (must match lib/universe.ts) ────────────────────────────────
ASX_SYMBOLS="BHP CBA CSL NAB ANZ WBC WES MQG TLS WOW RIO FMG TWE GMG STO ORG WDS QAN"
US_SYMBOLS="ACMR AEHR ATRC CRVL ERII FLNC GATO HIMS IIIV KTOS LBRT MARA MGNI MNDY NOVA NTST PHAT PRTS SHYF TMDX TEAM"

if   [ "$FILTER" = "ASX" ]; then SYMBOLS="$ASX_SYMBOLS"
elif [ "$FILTER" = "US"  ]; then SYMBOLS="$US_SYMBOLS"
else                              SYMBOLS="$ASX_SYMBOLS $US_SYMBOLS"
fi

TOTAL=$(echo $SYMBOLS | wc -w | tr -d ' ')
echo "=== Force-rescan $TOTAL stocks ($FILTER) — 2 at a time ==="
echo "Started: $(date)"
echo ""

done_count=0
fail_count=0

# ── Poll a single run until DONE / FAILED or timeout ─────────────────────────
wait_for_run() {
  local symbol="$1"
  local run_id="$2"
  local elapsed=0

  while [ $elapsed -lt $SCAN_TIMEOUT ]; do
    sleep $POLL_INTERVAL
    elapsed=$((elapsed + POLL_INTERVAL))

    status=$(curl -s "${BASE_URL}/api/run/${run_id}" | python3 -c "
import sys, json
try:
  d = json.load(sys.stdin)
  print(d.get('run', {}).get('status', 'UNKNOWN'))
except:
  print('ERROR')
" 2>/dev/null)

    if [ "$status" = "DONE" ]; then
      echo "  ✓ $symbol — done (${elapsed}s)"
      return 0
    elif [ "$status" = "FAILED" ]; then
      echo "  ✗ $symbol — FAILED (${elapsed}s)"
      return 1
    fi
  done

  echo "  ✗ $symbol — TIMEOUT after ${SCAN_TIMEOUT}s"
  return 1
}

# ── Scan in pairs ─────────────────────────────────────────────────────────────
arr=($SYMBOLS)
i=0

while [ $i -lt ${#arr[@]} ]; do
  s1="${arr[$i]}"
  s2="${arr[$i+1]:-}"

  echo "── Pair $((i/2 + 1)): $s1${s2:+ + $s2} ──"

  # Fire scan for s1
  run1=$(curl -s -X POST "${BASE_URL}/api/ticker/${s1}/scan" \
    -H "Content-Type: application/json" \
    -H "X-Internal-Token: ${INTERNAL_API_SECRET}" | python3 -c "
import sys, json
try: print(json.load(sys.stdin).get('runId',''))
except: print('')
" 2>/dev/null)

  # Fire scan for s2 (if exists)
  if [ -n "$s2" ]; then
    run2=$(curl -s -X POST "${BASE_URL}/api/ticker/${s2}/scan" \
      -H "Content-Type: application/json" \
      -H "X-Internal-Token: ${INTERNAL_API_SECRET}" | python3 -c "
import sys, json
try: print(json.load(sys.stdin).get('runId',''))
except: print('')
" 2>/dev/null)
  fi

  # Wait for both
  if [ -n "$run1" ]; then
    wait_for_run "$s1" "$run1" && done_count=$((done_count+1)) || fail_count=$((fail_count+1))
  else
    echo "  ✗ $s1 — failed to start scan"
    fail_count=$((fail_count+1))
  fi

  if [ -n "$s2" ]; then
    if [ -n "$run2" ]; then
      wait_for_run "$s2" "$run2" && done_count=$((done_count+1)) || fail_count=$((fail_count+1))
    else
      echo "  ✗ $s2 — failed to start scan"
      fail_count=$((fail_count+1))
    fi
  fi

  i=$((i+2))
  echo ""
done

echo "=== Complete: $done_count succeeded, $fail_count failed ==="
echo "Finished: $(date)"
