-- Contact Messages Table
-- Run this SQL in your Supabase SQL Editor to create the contact messages table

CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    inquiry_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    newsletter BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'unread', -- unread, read, replied
    replied_at TIMESTAMPTZ,
    replied_by UUID REFERENCES auth.users(id),
    notes TEXT, -- Internal notes for staff/admin use
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger for contact_messages
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit contact messages (public access for contact form)
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
    FOR INSERT 
    WITH CHECK (true);

-- Policy: Only staff and admin can view contact messages
CREATE POLICY "Staff and admin can view contact messages" ON contact_messages
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

-- Policy: Only staff and admin can update contact messages
CREATE POLICY "Staff and admin can update contact messages" ON contact_messages
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

-- Policy: Only admin can delete contact messages
CREATE POLICY "Admin can delete contact messages" ON contact_messages
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );