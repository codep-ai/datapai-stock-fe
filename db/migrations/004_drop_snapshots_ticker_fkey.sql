-- =============================================================================
-- Migration 004: drop snapshots_ticker_fkey
--
-- The snapshots.ticker → companies.ticker foreign key was blocking ALL
-- snapshot inserts because the companies table was never seeded.
-- On-demand scans can scan any ticker (not just ones in UNIVERSE_ALL),
-- so this FK constraint was too strict.
--
-- Also drop companies FK from snapshots if it exists (idempotent).
-- =============================================================================

ALTER TABLE datapai.snapshots
  DROP CONSTRAINT IF EXISTS snapshots_ticker_fkey;
