-- Description: Add duration_prices table for fixed-duration pricing model

-- Create the duration_prices table
CREATE TABLE duration_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_id UUID REFERENCES prices(id) ON DELETE CASCADE,
    duration_days INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add a unique constraint to ensure only one price per duration per price_id
ALTER TABLE duration_prices ADD CONSTRAINT unique_duration_per_price UNIQUE (price_id, duration_days);

-- Trigger for the duration_prices table
CREATE TRIGGER update_duration_prices_updated_at
    BEFORE UPDATE ON duration_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
