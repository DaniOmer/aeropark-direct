-- Description: Add flight number to reservations table

-- Migration up
ALTER TABLE reservations ADD COLUMN flight_number VARCHAR;

-- Migration down
-- ALTER TABLE reservations DROP COLUMN flight_number;

