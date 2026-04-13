-- Add amount_due_on_arrival for price difference when reservation dates are modified
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS amount_due_on_arrival NUMERIC(10,2) DEFAULT 0;
