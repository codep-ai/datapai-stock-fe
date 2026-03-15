-- Migration 006: User scan usage log for per-day scan quota enforcement
-- Each on-demand scan by an authenticated user is recorded here.

CREATE TABLE IF NOT EXISTS datapai.user_scan_log (
  id         bigserial PRIMARY KEY,
  user_id    text        NOT NULL,
  symbol     text        NOT NULL,
  scanned_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_scan_log_user_date_idx
  ON datapai.user_scan_log (user_id, scanned_at);
