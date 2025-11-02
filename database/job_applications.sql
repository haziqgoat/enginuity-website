-- Job Applications Table
-- Run this SQL in your Supabase SQL Editor to create the job applications table

CREATE TABLE IF NOT EXISTS job_applications (
    id BIGSERIAL PRIMARY KEY,
    job_opening_id BIGINT REFERENCES job_openings(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    university VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    graduation_year VARCHAR(10) NOT NULL,
    experience_level VARCHAR(100) NOT NULL,
    cover_letter TEXT,
    resume_url TEXT, -- URL to the uploaded resume file
    resume_filename VARCHAR(255), -- Original filename of the resume
    application_status VARCHAR(50) DEFAULT 'pending', -- pending, reviewing, interviewed, accepted, rejected
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    notes TEXT, -- Internal notes for HR/Admin use
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger for job_applications
CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_job_applications_job_opening_id ON job_applications(job_opening_id);
CREATE INDEX idx_job_applications_email ON job_applications(applicant_email);
CREATE INDEX idx_job_applications_status ON job_applications(application_status);
CREATE INDEX idx_job_applications_applied_at ON job_applications(applied_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit job applications (public access for application form)
CREATE POLICY "Anyone can submit job applications" ON job_applications
    FOR INSERT 
    WITH CHECK (true);

-- Policy: Applicants can view their own applications
CREATE POLICY "Applicants can view their own applications" ON job_applications
    FOR SELECT 
    USING (
        auth.jwt() ->> 'email' = applicant_email OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'role' = 'staff' OR 
                auth.users.raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

-- Policy: Only staff and admin can update application status and notes
CREATE POLICY "Staff and admin can update applications" ON job_applications
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

-- Policy: Only admin can delete applications
CREATE POLICY "Admin can delete applications" ON job_applications
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create Storage Bucket for Resumes (run this in the Supabase Dashboard)
-- Go to Storage > Create Bucket
-- Bucket name: "resumes"
-- Make it Private (not public)

-- Storage Policies for Resume Bucket
-- These should be created in Supabase Dashboard > Storage > Policies

-- Policy 1: Allow anyone to upload resumes
-- Name: "Allow resume uploads"
-- Operation: INSERT
-- Target: authenticated, anon
-- Policy: true

-- Policy 2: Allow staff and admin to download resumes
-- Name: "Staff and admin can download resumes"
-- Operation: SELECT
-- Target: authenticated
-- Policy: 
-- EXISTS (
--     SELECT 1 FROM auth.users 
--     WHERE auth.users.id = auth.uid() 
--     AND (
--         auth.users.raw_user_meta_data->>'role' = 'staff' OR 
--         auth.users.raw_user_meta_data->>'role' = 'admin'
--     )
-- )

-- Policy 3: Allow applicants to download their own resumes
-- Name: "Applicants can download their own resumes"
-- Operation: SELECT
-- Target: authenticated
-- Policy: 
-- auth.jwt() ->> 'email' IN (
--     SELECT applicant_email FROM job_applications 
--     WHERE resume_url LIKE '%' || name || '%'
-- )