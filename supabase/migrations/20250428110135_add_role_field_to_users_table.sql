-- Add role field to users table

-- Migration up
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

-- Migration down
-- ALTER TABLE users DROP COLUMN role;