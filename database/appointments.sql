-- Appointments Table
-- Run this SQL in your Supabase SQL Editor to create the appointments table

CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled
    confirmed_at TIMESTAMPTZ,
    confirmed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger for appointments
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_appointments_email ON appointments(email);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_created_at ON appointments(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit appointments (public access for appointment form)
CREATE POLICY "Anyone can submit appointments" ON appointments
    FOR INSERT 
    WITH CHECK (true);

-- Policy: Only staff and admin can view appointments
CREATE POLICY "Staff and admin can view appointments" ON appointments
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'staff' OR 
                auth.users.raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

-- Policy: Only staff and admin can update appointments
CREATE POLICY "Staff and admin can update appointments" ON appointments
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'staff' OR 
                auth.users.raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

-- Policy: Only admin can delete appointments
CREATE POLICY "Admin can delete appointments" ON appointments
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );