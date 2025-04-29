-- Add new fields to parking_lots table
ALTER TABLE parking_lots ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE parking_lots ADD COLUMN city TEXT NOT NULL;
ALTER TABLE parking_lots ADD COLUMN country TEXT NOT NULL;
ALTER TABLE parking_lots ADD COLUMN postal_code TEXT NOT NULL;
ALTER TABLE parking_lots ADD COLUMN phone TEXT NOT NULL;
ALTER TABLE parking_lots ADD COLUMN email TEXT NOT NULL;
ALTER TABLE parking_lots ADD COLUMN description TEXT NOT NULL;

-- DROP existing columns
ALTER TABLE parking_lots DROP COLUMN latitude;
ALTER TABLE parking_lots DROP COLUMN longitude;
