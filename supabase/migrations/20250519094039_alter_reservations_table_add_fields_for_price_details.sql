-- Add fields for price details
ALTER TABLE reservations
ADD COLUMN additional_people_fee NUMERIC DEFAULT 0,
ADD COLUMN late_fee NUMERIC DEFAULT 0;