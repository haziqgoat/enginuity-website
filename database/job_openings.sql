-- Job Openings Table
-- Run this SQL in your Supabase SQL Editor to create the job openings table

CREATE TABLE IF NOT EXISTS job_openings (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL DEFAULT 'Kuala Lumpur, Malaysia',
    type VARCHAR(50) NOT NULL DEFAULT 'Full-time',
    experience VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL DEFAULT '{}',
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

CREATE TRIGGER update_job_openings_updated_at
    BEFORE UPDATE ON job_openings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read job openings (public access)
CREATE POLICY "Anyone can view job openings" ON job_openings
    FOR SELECT USING (true);

-- Policy: Only staff and admin can insert job openings
CREATE POLICY "Staff and admin can create job openings" ON job_openings
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

-- Policy: Only staff and admin can update job openings
CREATE POLICY "Staff and admin can update job openings" ON job_openings
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

-- Policy: Only staff and admin can delete job openings
CREATE POLICY "Staff and admin can delete job openings" ON job_openings
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

-- Insert initial job openings data
INSERT INTO job_openings (title, department, location, type, experience, description, requirements) VALUES
(
    'Civil Engineer - Project Management',
    'Engineering',
    'Kuala Lumpur, Malaysia',
    'Full-time',
    'Fresh Graduate - 2 Years',
    'Join our project management team to oversee construction projects from planning to completion. Work with clients, contractors, and stakeholders to ensure successful project delivery.',
    ARRAY[
        'Bachelor''s degree in Civil Engineering or related field',
        'Knowledge of construction project management principles',
        'Understanding of building codes, regulations, and safety standards',
        'Proficiency in AutoCAD, project management software',
        'Fresh graduates with strong academic performance are welcome'
    ]
),
(
    'Structural Engineer',
    'Engineering',
    'Kuala Lumpur, Malaysia',
    'Full-time',
    'Fresh Graduate - 2 Years',
    'Design and analyze structural systems for residential, commercial, and industrial projects. Ensure structural integrity and compliance with Malaysian building standards.',
    ARRAY[
        'Bachelor''s degree in Civil/Structural Engineering',
        'Knowledge of structural analysis and design principles',
        'Familiarity with design software (STAAD Pro, ETABS, SAP2000)',
        'Understanding of Malaysian building codes (MS standards)',
        'Strong analytical and problem-solving skills'
    ]
),
(
    'Construction Site Supervisor',
    'Operations',
    'Kuala Lumpur, Malaysia',
    'Full-time',
    'Fresh Graduate - 1 Year',
    'Supervise daily construction activities, ensure quality control, and maintain safety standards on construction sites. Coordinate with contractors and report project progress.',
    ARRAY[
        'Diploma/Bachelor''s degree in Civil Engineering, Construction Management, or related field',
        'Knowledge of construction methods and materials',
        'Understanding of safety regulations and quality control',
        'Strong leadership and communication skills',
        'Willingness to work on-site and travel to project locations'
    ]
),
(
    'Quantity Surveyor',
    'Commercial',
    'Kuala Lumpur, Malaysia',
    'Full-time',
    'Fresh Graduate - 1 Year',
    'Manage project costs, prepare tender documents, and conduct cost analysis for construction projects. Work closely with clients and contractors on commercial aspects.',
    ARRAY[
        'Bachelor''s degree in Quantity Surveying, Construction Management, or related field',
        'Knowledge of construction cost estimation and contract administration',
        'Familiarity with measurement and billing procedures',
        'Understanding of construction contracts and procurement',
        'Strong numerical and analytical skills'
    ]
),
(
    'Building Services Engineer (M&E)',
    'Engineering',
    'Kuala Lumpur, Malaysia',
    'Full-time',
    'Fresh Graduate - 2 Years',
    'Design and coordinate mechanical and electrical systems for buildings. Ensure efficient and sustainable building services integration in construction projects.',
    ARRAY[
        'Bachelor''s degree in Mechanical, Electrical, or Building Services Engineering',
        'Knowledge of HVAC, electrical, and plumbing systems',
        'Familiarity with building services design software',
        'Understanding of energy efficiency and sustainability principles',
        'Interest in green building technologies and certifications'
    ]
),
(
    'Construction Technology Specialist',
    'Technology',
    'Kuala Lumpur, Malaysia',
    'Full-time',
    'Fresh Graduate - 1 Year',
    'Bridge the gap between construction and technology by implementing digital solutions for project management, BIM coordination, and construction automation.',
    ARRAY[
        'Bachelor''s degree in Civil Engineering, Construction Management, or Computer Science',
        'Interest in construction technology and digital transformation',
        'Knowledge of BIM software (Revit, Navisworks) is advantageous',
        'Understanding of project management software and digital tools',
        'Strong problem-solving skills and adaptability to new technologies'
    ]
);