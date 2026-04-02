-- ============================================================
-- Auto-expire pending reservations after 30 minutes
-- Fixes: abandoned bookings blocking capacity indefinitely
-- ============================================================

CREATE OR REPLACE FUNCTION expire_pending_reservations()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE reservations
  SET status = 'cancelled',
      updated_at = CURRENT_TIMESTAMP
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '30 minutes';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION expire_pending_reservations TO anon, authenticated;
