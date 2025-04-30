-- Add capacities fields to parking lots

-- ADD cars capacities
ALTER TABLE parking_lots
ADD COLUMN capacity_small_cars INTEGER,
ADD COLUMN capacity_large_cars INTEGER;

-- ADD motorcycles capacities
ALTER TABLE parking_lots
ADD COLUMN capacity_small_motorcycles INTEGER,
ADD COLUMN capacity_large_motorcycles INTEGER;


