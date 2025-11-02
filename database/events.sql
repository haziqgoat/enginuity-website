-- Events Table
-- Run this SQL in your Supabase SQL Editor to create the events table

CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    attendees TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Row Level Security (RLS) Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Staff and admin can view all events
CREATE POLICY "Staff and admin can view events" ON events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'staff' OR 
                auth.users.raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

-- Policy: Staff and admin can create events
CREATE POLICY "Staff and admin can create events" ON events
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'staff' OR 
                auth.users.raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

-- Policy: Staff and admin can update their own events
CREATE POLICY "Staff and admin can update their events" ON events
    FOR UPDATE 
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policy: Staff can delete their own events, admin can delete any events
CREATE POLICY "Staff can delete their events, admin can delete any" ON events
    FOR DELETE 
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );