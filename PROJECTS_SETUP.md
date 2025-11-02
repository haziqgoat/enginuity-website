# Projects Management System Setup Guide

## Database Setup

1. **Run the SQL schema in your Supabase dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the contents of `database/projects.sql`
   - This will create the `projects` table with proper RLS policies

2. **Verify table creation:**
   ```sql
   SELECT * FROM projects LIMIT 5;
   ```

## Environment Configuration

Ensure you have the required environment variables in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Features

### For Admin and Staff Users:
- **Add Projects**: Click the "Add Project" button on the projects page to create new projects
- **Edit Projects**: Click the edit icon on any project card to modify project details
- **Delete Projects**: Click the delete icon on any project card to remove projects
- **Full CRUD Operations**: Complete create, read, update, delete functionality

### For All Users:
- **View Projects**: Browse all projects in a clean, professional layout
- **Filter Projects**: Filter projects by category (Residential, Commercial, Industrial, etc.)
- **Project Details**: View comprehensive project information including status, budget, team size, and features

## Project Data Structure

Each project includes:
- **Basic Info**: Title, description, location, client name
- **Project Metrics**: Duration, budget, team size, status
- **Classification**: Category, status (planning/ongoing/completed/on_hold)
- **Features**: Key project highlights and capabilities
- **Media**: Project image URL
- **Dates**: Optional start and end dates
- **Audit Trail**: Created/updated timestamps and user tracking

## Role-Based Access Control

- **Clients**: View-only access to projects
- **Staff**: Can create, edit, and delete projects
- **Admin**: Full access to all project management features

## API Endpoints

- `GET /api/projects` - Fetch all projects (public)
- `POST /api/projects` - Create new project (staff/admin only)
- `GET /api/projects/[id]` - Fetch single project (public)
- `PUT /api/projects/[id]` - Update project (staff/admin only)
- `DELETE /api/projects/[id]` - Delete project (staff/admin only)

## Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Role-based API access**: Server-side role verification
- **JWT Authentication**: Secure token-based authentication
- **Input validation**: Comprehensive form validation with Zod schemas

## Usage Tips

1. **Adding Projects**: Ensure all required fields are filled. Features can be added dynamically.
2. **Image URLs**: Use publicly accessible image URLs for best results.
3. **Categories**: Use consistent category names for better filtering.
4. **Status Updates**: Keep project status updated for accurate portfolio representation.
5. **Team Management**: Only users with staff or admin roles can manage projects.

## Troubleshooting

### Common Issues:

1. **Cannot add/edit projects**: Verify user has staff or admin role
2. **Database errors**: Check RLS policies and service role key configuration
3. **Images not loading**: Ensure image URLs are publicly accessible
4. **Authentication errors**: Verify JWT token is valid and user is authenticated

### Database Permissions:

If you encounter permission issues, verify the RLS policies are correctly applied:

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'projects';

-- View current policies
SELECT * FROM pg_policies WHERE tablename = 'projects';
```

## Integration

The projects system integrates seamlessly with your existing:
- Authentication system (Supabase Auth)
- Role management (lib/roles.ts)
- UI components (shadcn/ui)
- Toast notifications
- Navigation and layout

This system provides a complete, production-ready project management solution for your construction consulting website.