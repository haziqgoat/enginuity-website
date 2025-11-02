-- SQL query to remove duration, budget, team_size, status, start_date, and end_date columns from projects table
-- Run this SQL in your Supabase SQL Editor to update the projects table schema

-- First, disable RLS temporarily to avoid conflicts
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Remove the columns
ALTER TABLE projects
DROP COLUMN IF EXISTS duration,
DROP COLUMN IF EXISTS budget,
DROP COLUMN IF EXISTS team_size,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS start_date,
DROP COLUMN IF EXISTS end_date;

-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Update the sample data to match the new schema
-- Since we're removing columns, existing data in those columns will be automatically removed
-- But we should update the INSERT statements to match the new schema

-- Note: The existing data in the removed columns will be lost when the columns are dropped
-- If you need to preserve any of that data, please back it up before running this script