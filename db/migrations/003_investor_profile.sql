-- =============================================================================
-- Migration 003: investor_profile
-- Keyed on TEXT user_id (Next.js UUID auth) — separate from the legacy
-- datapai.user_profiles table (which uses INTEGER ids from Python's system).
--
-- Apply:
--   psql $DATABASE_URL -f db/migrations/003_investor_profile.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- investor_profile  — rich per-user investment identity
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datapai.investor_profile (
    user_id               TEXT         NOT NULL,   -- UUID from Next.js auth (users.id)

    -- ── Core investment identity ─────────────────────────────────────────────
    risk_tolerance        VARCHAR(20)  NOT NULL DEFAULT 'MODERATE',
    -- CONSERVATIVE | MODERATE | AGGRESSIVE | SPECULATIVE

    investment_horizon    VARCHAR(20)  NOT NULL DEFAULT 'MEDIUM',
    -- SHORT (< 3 months swing) | MEDIUM (3–12 months) | LONG (1 yr+)

    strategies            TEXT[]       NOT NULL DEFAULT '{}',
    -- VALUE | GROWTH | MOMENTUM | DIVIDEND | INDEX | SWING

    -- ── Market preferences ──────────────────────────────────────────────────
    preferred_exchanges   TEXT[]       NOT NULL DEFAULT '{US}',
    -- US | ASX (or both)

    preferred_sectors     TEXT[]       NOT NULL DEFAULT '{}',
    -- Technology | Healthcare | Financials | Energy | etc.  (empty = no filter)

    excluded_sectors      TEXT[]       NOT NULL DEFAULT '{}',

    -- ── Portfolio context ────────────────────────────────────────────────────
    portfolio_size        VARCHAR(20)  NOT NULL DEFAULT 'RETAIL',
    -- STARTER (<50k) | RETAIL (50–500k) | HNW (500k–2M) | INSTITUTIONAL (2M+)

    portfolio_tickers     TEXT[]       NOT NULL DEFAULT '{}',
    -- tickers they own / track closely — used to personalise reports

    -- ── Analysis preference ─────────────────────────────────────────────────
    analysis_preference   VARCHAR(20)  NOT NULL DEFAULT 'MIX',
    -- TA | FA | MIX | OTHER

    -- ── Language preference ──────────────────────────────────────────────────
    preferred_lang        VARCHAR(10)  NOT NULL DEFAULT 'en',
    -- en | zh

    -- ── AI behaviour ────────────────────────────────────────────────────────
    response_style        VARCHAR(20)  NOT NULL DEFAULT 'BALANCED',
    -- BRIEF (bullets only) | BALANCED | DETAILED (full reasoning)

    show_risk_warnings    BOOLEAN      NOT NULL DEFAULT TRUE,
    esg_only              BOOLEAN      NOT NULL DEFAULT FALSE,
    tax_context           VARCHAR(10)  NOT NULL DEFAULT 'AU',
    -- AU | US | INTL

    -- ── Screener defaults (saved filter state) ───────────────────────────────
    screener_defaults     JSONB        NOT NULL DEFAULT '{}',
    -- { exchange, signal, sector, minScore, maxRisk, limit }

    -- ── Onboarding state ────────────────────────────────────────────────────
    onboarding_completed  BOOLEAN      NOT NULL DEFAULT FALSE,
    onboarding_step       SMALLINT     NOT NULL DEFAULT 0,

    -- ── Metadata ────────────────────────────────────────────────────────────
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT investor_profile_pkey PRIMARY KEY (user_id),
    CONSTRAINT investor_profile_user_fk
        FOREIGN KEY (user_id) REFERENCES datapai.users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_investor_profile_user
    ON datapai.investor_profile (user_id);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION datapai.touch_investor_profile()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_investor_profile_updated_at ON datapai.investor_profile;
CREATE TRIGGER trg_investor_profile_updated_at
    BEFORE UPDATE ON datapai.investor_profile
    FOR EACH ROW EXECUTE FUNCTION datapai.touch_investor_profile();
