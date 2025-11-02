-- Team Members Table
-- Run this SQL in your Supabase SQL Editor to create the team_members table

CREATE TABLE IF NOT EXISTS team_members (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    image_url TEXT,
    linkedin_url TEXT,
    email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read team members (public access)
CREATE POLICY "Anyone can view team members" ON team_members
    FOR SELECT USING (true);

-- Policy: Only staff and admin can insert team members
CREATE POLICY "Staff and admin can create team members" ON team_members
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

-- Policy: Only staff and admin can update team members
CREATE POLICY "Staff and admin can update team members" ON team_members
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

-- Policy: Only staff and admin can delete team members
CREATE POLICY "Staff and admin can delete team members" ON team_members
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

-- Insert initial team member data
INSERT INTO team_members (name, position, company, bio, image_url) VALUES
(
    'Ir. Hj. Zainal Mukri bin Md. Mustaffa',
    'Managing Director',
    'HNZ Consult Sdn. Bhd.',
    'Professional Engineer with 25+ years experience. B.Eng (Hons) Civil Engineering from UTM. P.Eng (12487), MIEM (26908).',
    '/professional-malaysian-ceo-construction-technology.jpg'
),
(
    'Ir. Hj. Nor Azmee bin Idris',
    'Director',
    'HNZ Consult Sdn. Bhd.',
    'Professional Engineer with 31+ years experience. B.Eng (Hons) Civil Engineering from UTM. P.Eng (11144), specializing in infrastructure and structural works.',
    '/professional-asian-male-software-engineer.jpg'
),
(
    'Ir. Hj. Abdul Ghani Shaaban',
    'Associate Director',
    'HNZ Consult Sdn. Bhd.',
    'MSc Foundation Engineering from University of Birmingham, UK. 40+ years experience in geotechnical engineering. P.Eng (C113711), MIEM (M34412).',
    '/professional-malaysian-engineer-construction-consu.jpg'
),
(
    'Muhammad Shaifull Izwan B. Ab Hamid',
    'Civil Engineer',
    'HNZ Consult Sdn. Bhd.',
    'B.Eng (Hons) Civil Engineering from UPM (2010). Experienced in structural design and project management.',
    '/professional-asian-male-software-engineer.jpg'
),
(
    'Mohd. Hafindze Bin Zulkifli',
    'Civil Engineer',
    'HNZ Consult Sdn. Bhd.',
    'B.Eng (Hons) Civil Engineering from UiTM (2017). Specializes in infrastructure and building engineering projects.',
    '/professional-malaysian-engineer-construction-consu.jpg'
),
(
    'Nor Zalina Binti Zakaria',
    'Building Engineer',
    'HNZ Consult Sdn. Bhd.',
    'B.Eng (Hons) Building Engineering from UNIMAP (2013). Expert in building design and construction management.',
    '/professional-malaysian-female-project-consultant.jpg'
);