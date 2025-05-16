-- Description: Add departure and return flight numbers to reservations table

-- Migration up
ALTER TABLE reservations 
  ADD COLUMN departure_flight_number VARCHAR,
  ADD COLUMN return_flight_number VARCHAR;

-- Copy existing flight_number values to departure_flight_number for backward compatibility
UPDATE reservations 
SET departure_flight_number = flight_number 
WHERE flight_number IS NOT NULL;

-- Migration down
-- ALTER TABLE reservations DROP COLUMN departure_flight_number;
-- ALTER TABLE reservations DROP COLUMN return_flight_number;
