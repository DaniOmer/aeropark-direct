-- Description: Add cgu and cgu_acceptance_date to users table

-- Migrations up
ALTER TABLE users ADD COLUMN cgu BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN cgu_acceptance_date TIMESTAMP;

-- Set cgu to true and cgu_acceptance_date to now for existing users
UPDATE users SET cgu = TRUE, cgu_acceptance_date = NOW();

-- Migrations down
-- ALTER TABLE users DROP COLUMN cgu;
-- ALTER TABLE users DROP COLUMN cgu_acceptance_date;
