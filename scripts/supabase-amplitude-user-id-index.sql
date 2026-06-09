-- Optional: run in Supabase SQL editor for faster unique-wallet queries.
CREATE INDEX IF NOT EXISTS amplitude_events_user_id_event_day_idx
  ON amplitude_events (user_id, event_day)
  WHERE user_id IS NOT NULL;
