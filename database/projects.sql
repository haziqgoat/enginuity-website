-- Projects Table
-- Run this SQL in your Supabase SQL Editor to create the projects table

CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    features TEXT[] NOT NULL DEFAULT '{}',
    client_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
    -- Removed duration, budget, team_size, status, start_date, end_date
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read projects (public access)
CREATE POLICY "Anyone can view projects" ON projects
    FOR SELECT USING (true);

-- Policy: Only staff and admin can insert projects
CREATE POLICY "Staff and admin can create projects" ON projects
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

-- Policy: Only staff and admin can update projects
CREATE POLICY "Staff and admin can update projects" ON projects
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

-- Policy: Only staff and admin can delete projects
CREATE POLICY "Staff and admin can delete projects" ON projects
    FOR DELETE 
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

-- Insert initial project data (updated to match new schema)
INSERT INTO projects (title, description, location, category, image_url, features, client_name) VALUES
(
    'Skyline Residential Complex',
    'A modern 25-story residential complex with 200 units, featuring sustainable design and smart home technology.',
    'Kuala Lumpur, Malaysia',
    'Residential',
    '/modern-residential-complex-building.jpg',
    ARRAY[
        'Smart home automation systems',
        'Green building certification',
        'Underground parking facility',
        'Rooftop garden and amenities'
    ],
    'Perbadanan Kemajuan Negeri Selangor (PKNS)'
),
(
    'Metro Shopping Center',
    'Large-scale commercial development with retail spaces, entertainment zones, and office towers.',
    'Johor Bahru, Malaysia',
    'Commercial',
    '/modern-shopping-center-mall-construction.jpg',
    ARRAY[
        'Multi-level retail spaces',
        'IMAX cinema complex',
        'Food court and restaurants',
        'Office tower integration'
    ],
    'Metro Development Sdn Bhd'
),
(
    'Industrial Manufacturing Hub',
    'State-of-the-art manufacturing facility with automated systems and sustainable energy solutions.',
    'Penang, Malaysia',
    'Industrial',
    '/modern-manufacturing-facility.png',
    ARRAY[
        'Automated production lines',
        'Solar energy systems',
        'Waste management facility',
        'Quality control laboratories'
    ],
    'Penang Development Corporation'
),
(
    'Heritage Hotel Restoration',
    'Careful restoration of a colonial-era building into a luxury boutique hotel while preserving historical elements.',
    'George Town, Penang',
    'Heritage',
    '/heritage-colonial-building-hotel-restoration.jpg',
    ARRAY[
        'Historical facade preservation',
        'Modern interior amenities',
        'Boutique hotel suites',
        'Cultural heritage compliance'
    ],
    'Heritage Hotels Group'
),
(
    'Smart Office Tower',
    'Next-generation office building with AI-powered building management and sustainable design features.',
    'Cyberjaya, Malaysia',
    'Commercial',
    '/modern-smart-office-tower-building.jpg',
    ARRAY[
        'AI building management',
        'Energy-efficient systems',
        'Flexible workspace design',
        'High-speed connectivity'
    ],
    'Cyberjaya Development Corporation'
),
(
    'Waterfront Condominiums',
    'Luxury waterfront residential development with marina access and premium amenities.',
    'Putrajaya, Malaysia',
    'Residential',
    '/luxury-waterfront-condominium-marina.jpg',
    ARRAY[
        'Marina and boat access',
        'Infinity pool and spa',
        'Waterfront dining',
        'Private beach access'
    ],
    'Putrajaya Holdings Sdn Bhd'
);