-- Run once in the custom Supabase SQL editor before backfill / dune sync.
-- One row per CELINA-tagged txn; columns match the Dune query result set.

CREATE TABLE IF NOT EXISTS dune_celina_txns (
  hash text PRIMARY KEY,
  day timestamptz NOT NULL,
  txn_count int NOT NULL,
  cumulative_txns int NOT NULL,
  block_time timestamptz NOT NULL,
  block_number bigint NOT NULL,
  "from" text NOT NULL,
  "to" text NOT NULL,
  synced_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dune_celina_txns_block_time_desc_idx
  ON dune_celina_txns (block_time DESC);

CREATE INDEX IF NOT EXISTS dune_celina_txns_block_number_desc_idx
  ON dune_celina_txns (block_number DESC);

CREATE TABLE IF NOT EXISTS dune_sync_state (
  id int PRIMARY KEY,
  last_synced_at timestamptz NOT NULL,
  last_execution_ended_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO dune_sync_state (id, last_synced_at)
VALUES (1, '1970-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;
