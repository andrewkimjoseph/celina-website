-- Run once in the custom Supabase SQL editor (stats cache project).
-- Replaces slow paginated amplitude_events scans in the website read path.

-- Faster device_id lookups for unique-device counts.
CREATE INDEX IF NOT EXISTS amplitude_events_event_day_device_id_idx
  ON amplitude_events (event_day, device_id)
  WHERE device_id IS NOT NULL;

-- Per-day distinct wallet addresses queried (0x…40 hex).
CREATE OR REPLACE VIEW amplitude_daily_queried_wallets AS
SELECT
  event_day AS day,
  COUNT(DISTINCT lower(user_id))::bigint AS count
FROM amplitude_events
WHERE user_id IS NOT NULL
  AND user_id ~ '^0x[a-fA-F0-9]{40}$'
GROUP BY event_day;

-- Unique MCP install device_ids in lookback window (excludes integration IDs).
CREATE OR REPLACE FUNCTION amplitude_unique_device_count(since_day date)
RETURNS bigint
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(DISTINCT device_id)::bigint
  FROM amplitude_events
  WHERE event_day >= since_day
    AND device_id IS NOT NULL
    AND trim(device_id) <> ''
    AND device_id NOT IN ('celina-sdk', 'andrewkimjoseph_celina_sdk');
$$;

-- Total distinct queried wallets in lookback window.
CREATE OR REPLACE FUNCTION amplitude_wallets_queried_total(since_day date)
RETURNS bigint
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(DISTINCT lower(user_id))::bigint
  FROM amplitude_events
  WHERE event_day >= since_day
    AND user_id IS NOT NULL
    AND user_id ~ '^0x[a-fA-F0-9]{40}$';
$$;

GRANT SELECT ON amplitude_daily_queried_wallets TO service_role;
GRANT EXECUTE ON FUNCTION amplitude_unique_device_count(date) TO service_role;
GRANT EXECUTE ON FUNCTION amplitude_wallets_queried_total(date) TO service_role;
