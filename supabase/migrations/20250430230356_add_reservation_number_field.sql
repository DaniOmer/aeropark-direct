-- Add reservation number field to reservations table
ALTER TABLE reservations
ADD COLUMN number TEXT;

-- Update existing reservations with a default number
UPDATE reservations
SET number = 'RES-' || encode(gen_random_bytes(4), 'hex');

-- Create function to generate reservation numbers
CREATE OR REPLACE FUNCTION set_reservation_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.number := 'RES-' || encode(gen_random_bytes(4), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set the reservation number
CREATE TRIGGER set_reservation_number
BEFORE INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION set_reservation_number();
