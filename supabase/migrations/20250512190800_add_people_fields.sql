-- Description: Add number_of_people field to reservations table and people pricing fields to prices table

-- Add number_of_people field to reservations table
ALTER TABLE reservations ADD COLUMN number_of_people INTEGER DEFAULT 1;

-- Add people_threshold and additional_people_fee fields to prices table
ALTER TABLE prices ADD COLUMN people_threshold INTEGER DEFAULT 4;
ALTER TABLE prices ADD COLUMN additional_people_fee NUMERIC(10,2) DEFAULT 8.00;
