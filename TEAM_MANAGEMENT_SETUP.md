# Team Management System Setup

This document provides instructions for setting up the team management system that allows admins to add, edit, and delete team members.

## Database Setup

1. Run the SQL script located at `database/team_members.sql` in your Supabase SQL Editor:
   - This will create the `team_members` table
   - Set up Row Level Security (RLS) policies
   - Insert initial team member data

## API Routes

The system uses the following API endpoints:

- `GET /api/team-members` - Fetch all team members (public access)
- `POST /api/team-members` - Create a new team member (admin/staff only)
- `PUT /api/team-members` - Update an existing team member (admin/staff only)
- `DELETE /api/team-members` - Delete a team member (admin/staff only)

## Admin Functionality

1. Only users with `admin` or `staff` roles can manage team members
2. Navigate to the "About" page to view the team section
3. Admins will see "Add Member" button and edit/delete icons on each team member card
4. Click "Add Member" to create a new team member using the form
5. Click the edit icon (pencil) on a team member card to update their information
6. Click the delete icon (trash) to remove a team member

## Team Member Form Fields

When adding or editing a team member, the following fields are available:

- **Name** (required): Full name of the team member
- **Position** (required): Job title/position
- **Company** (required): Company name
- **Bio** (required): Short biography/description
- **Image URL** (optional): URL to the team member's photo
- **LinkedIn URL** (optional): Link to LinkedIn profile
- **Email** (optional): Contact email address

## Security

- All API routes are protected and require authentication
- Only admin and staff users can modify team member data
- Regular users and visitors can only view team members
- Row Level Security policies are enforced at the database level

## Usage Instructions

1. Log in as an admin or staff user
2. Navigate to the "About" page
3. Use the "Add Member" button to create new team members
4. Use the edit (pencil) and delete (trash) icons on team member cards to modify existing members
5. All changes are saved to the database and visible to all site visitors immediately