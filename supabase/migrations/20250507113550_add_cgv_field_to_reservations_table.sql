-- Description: Add cgv field to reservations table

-- Migrations up
ALTER TABLE reservations ADD COLUMN cgv BOOLEAN DEFAULT FALSE;

-- Migrations down
-- ALTER TABLE reservations DROP COLUMN cgv;