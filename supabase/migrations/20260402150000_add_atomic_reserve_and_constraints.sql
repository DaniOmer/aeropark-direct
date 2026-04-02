-- ============================================================
-- Atomic reservation function + safety constraints
-- Fixes: race condition (TOCTOU), overlap query bug (OR→AND)
-- ============================================================

-- 1. Atomic reserve function with row-level locking
CREATE OR REPLACE FUNCTION reserve_parking_slot(
  p_user_id UUID,
  p_parking_lot_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_vehicle_type TEXT,
  p_vehicle_brand TEXT,
  p_vehicle_model TEXT,
  p_vehicle_color TEXT,
  p_vehicle_plate TEXT,
  p_total_price NUMERIC,
  p_additional_people_fee NUMERIC DEFAULT 0,
  p_departure_flight_number TEXT DEFAULT NULL,
  p_return_flight_number TEXT DEFAULT NULL,
  p_number_of_people INTEGER DEFAULT 1,
  p_cgv BOOLEAN DEFAULT FALSE
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_capacity INTEGER;
  v_reserved_count INTEGER;
  v_capacity_field TEXT;
  v_reservation_id UUID;
BEGIN
  -- Determine which capacity field to check
  CASE p_vehicle_type
    WHEN 'small_car' THEN v_capacity_field := 'capacity_small_cars';
    WHEN 'large_car' THEN v_capacity_field := 'capacity_large_cars';
    WHEN 'small_motorcycle' THEN v_capacity_field := 'capacity_small_motorcycles';
    WHEN 'large_motorcycle' THEN v_capacity_field := 'capacity_large_motorcycles';
    ELSE RETURN json_build_object('success', false, 'error', 'Type de véhicule non valide');
  END CASE;

  -- Lock the parking lot row to serialize concurrent reservation attempts
  EXECUTE format(
    'SELECT %I FROM parking_lots WHERE id = $1 FOR UPDATE',
    v_capacity_field
  ) INTO v_capacity USING p_parking_lot_id;

  IF v_capacity IS NULL OR v_capacity = 0 THEN
    RETURN json_build_object('success', false, 'error', 'Aucune place disponible pour ce type de véhicule');
  END IF;

  -- Count overlapping reservations (correct AND logic, not OR)
  SELECT COUNT(*) INTO v_reserved_count
  FROM reservations
  WHERE parking_lot_id = p_parking_lot_id
    AND vehicle_type = p_vehicle_type
    AND status IN ('confirmed', 'pending')
    AND start_date <= p_end_date
    AND end_date >= p_start_date;

  IF v_reserved_count >= v_capacity THEN
    RETURN json_build_object(
      'success', false,
      'error', format('Pas de place disponible pour cette période. Capacité: %s, Réservations: %s', v_capacity, v_reserved_count)
    );
  END IF;

  -- Insert the reservation atomically (still holding the lock)
  INSERT INTO reservations (
    user_id, parking_lot_id, start_date, end_date,
    vehicle_type, vehicle_brand, vehicle_model, vehicle_color, vehicle_plate,
    total_price, additional_people_fee, status,
    departure_flight_number, return_flight_number, number_of_people, cgv
  ) VALUES (
    p_user_id, p_parking_lot_id, p_start_date, p_end_date,
    p_vehicle_type, p_vehicle_brand, p_vehicle_model, p_vehicle_color, p_vehicle_plate,
    p_total_price, p_additional_people_fee, 'pending',
    p_departure_flight_number, p_return_flight_number, p_number_of_people, p_cgv
  )
  RETURNING id INTO v_reservation_id;

  RETURN json_build_object('success', true, 'id', v_reservation_id);
END;
$$;

-- Grant execute to both anon and authenticated roles
GRANT EXECUTE ON FUNCTION reserve_parking_slot TO anon, authenticated;

-- 2. Safety constraints
ALTER TABLE reservations
ADD CONSTRAINT reservations_status_check
CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));

ALTER TABLE reservations
ADD CONSTRAINT reservations_date_order_check
CHECK (end_date > start_date);

-- 3. Index for efficient overlap queries
CREATE INDEX idx_reservations_overlap
ON reservations (parking_lot_id, vehicle_type, status, start_date, end_date)
WHERE status IN ('confirmed', 'pending');
