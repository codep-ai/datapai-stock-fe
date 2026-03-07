# DataP.ai + TinyFish
# Build Spec v2.1 (Accelerator Demo Version)

Goal:
Upgrade the current v2 demo to be judge-ready for the TinyFish accelerator.

The system must clearly demonstrate:
TinyFish = web execution infrastructure
DataP.ai = AI + trust + financial signal layer

The system must:
- run scans without repeated user permission
- reduce noisy alerts
- clearly show TinyFish partnership
- show credible financial signals
- be reliable and easy to demo

Existing architecture must remain unchanged.

Stack:
Next.js
SQLite (radar_v2.db)
TinyFish API
Paid LLM (Gemini/OpenAI)
better-sqlite3

Do not redesign the database schema.

--------------------------------------------------

FEATURE 1 — FIX LOGO RENDERING

Problem:
Only TinyFish logo renders correctly.

Solution:
Move all logos to /public/logos

Directory structure:

/public/logos/tinyfish.svg
/public/logos/datapai.svg
/public/logos/asx.svg
/public/logos/nasdaq.svg

Use Next Image component.

Example:

import Image from "next/image"

<Image
  src="/logos/datapai.svg"
  width={120}
  height={32}
  alt="DataP.ai"
/>

Rules:
- do not use relative paths
- do not fetch logos remotely
- all logos must load from /public

Header should display:

[TinyFish logo] powered by [DataP.ai logo]

--------------------------------------------------

FEATURE 2 — NON-BLOCKING SCAN (NO PERMISSION LOOP)

Problem:
Scanning repeatedly asks for permission.

Requirement:
User clicks once → scan runs to completion.

API endpoint:

POST /api/run

Return:

{ runId }

Scanning must run asynchronously.

Example implementation:

export async function POST() {
  const runId = createRun()
  runScanAsync(runId)
  return NextResponse.json({ runId })
}

UI must poll:

GET /api/run/:id

Polling interval:
2 seconds.

Button behavior:

Run Scan → disabled while running
Button text → "Scanning..."

--------------------------------------------------

FEATURE 3 — FIX RUN STATUS

Problem:
Homepage sometimes shows:

0 scanned

Requirement:
Run must have proper lifecycle states.

States:

PENDING
RUNNING
SUCCESS
FAILED

Run summary fields:

planned_count
completed_count
changed_count
failed_count

Homepage must display:

Last scan:
20 scanned
3 changed
0 failed

Run must automatically transition to SUCCESS when finished.

--------------------------------------------------

FEATURE 4 — SIGNAL QUALITY CLASSIFICATION

Problem:
Many alerts are archive/list changes.

Add signal classification.

Types:

CONTENT_CHANGE
ARCHIVE_CHANGE
LAYOUT_CHANGE

Classification rules:

ARCHIVE_CHANGE if many lines contain:
date:
headline:
press_release:

LAYOUT_CHANGE if:
changed_pct > 80 AND risk_delta == 0

Otherwise:

CONTENT_CHANGE

Store classification in analyses.signal_type.

--------------------------------------------------

FEATURE 5 — ALERT FILTERING

Default alerts view must show only:

CONTENT_CHANGE

Add UI toggle:

[Content Only] [All Signals]

--------------------------------------------------

FEATURE 6 — AI SUMMARY FORMAT

AI output must follow strict structure:

What changed:
(one sentence)

Why it matters:
(one sentence)

Evidence:
• quote 1
• quote 2

AI must NOT give buy/sell advice.

--------------------------------------------------

FEATURE 7 — PRICE CONTEXT IMPROVEMENT

Add additional context.

Display:

Last close
1 day change
5 day range

Example:

Last close: $51.54
1d change: +2.1%
5d range: $49.8 – $52.1

Prices must come from the prices table.

--------------------------------------------------

FEATURE 8 — RUN DETAIL VISIBILITY

Run detail page must show:

Ticker
Status
Duration
TinyFish run reference

Statuses:

Queued
Scanning
Completed
Failed

--------------------------------------------------

FEATURE 9 — SCAN STEP LOG

Each ticker must show step progress:

Fetching page
Extracting content
Cleaning text
Computing diff
Running AI analysis

Purpose:
Demonstrate TinyFish execution clearly.

--------------------------------------------------

FEATURE 10 — SAFE DEBUG ENDPOINT

Create endpoint:

GET /api/debug

Return:

{
  hasTinyfishKey: true,
  hasPaidLLMKey: true,
  dbPath: ".../radar_v2.db",
  version: "v2.1"
}

Never return secret values.

--------------------------------------------------

FEATURE 11 — HOMEPAGE MESSAGE

Headline:

Detect Meaningful Website Changes
Before Markets React

Subtext:

TinyFish scans company websites.
DataP.ai converts wording changes into financial signals.

--------------------------------------------------

FEATURE 12 — DEMO READINESS

Homepage must display:

Last scan summary
Top alerts
Run live scan button

User must understand the product within 5 seconds.

--------------------------------------------------

DEFINITION OF DONE

v2.1 complete when:

- all logos render properly
- scan runs without repeated permission prompts
- run summary displays correct counts
- alerts filter noisy signals
- AI summary structured correctly
- price context improved
- TinyFish scan steps visible
- debug endpoint available

--------------------------------------------------

KEY PRINCIPLE

Do NOT compete with TinyFish.

TinyFish = browser execution infrastructure.

DataP.ai = financial intelligence layer.

--------------------------------------------------

TARGET COMPLETION

1–2 focused coding sessions.

Focus on reliability, clarity, and demo quality.

Once you have done all of these. run the sync.sh to push to the server; if u can remotely re-build the application and restart tiny servic via ssh,  go ahead

