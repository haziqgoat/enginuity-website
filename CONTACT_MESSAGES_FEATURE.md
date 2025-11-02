# Contact Messages Feature

This document describes the implementation of the contact messages feature that allows visitors to send messages through the contact form, which are then stored in the database and accessible to staff and admin users.

## Features

1. **Contact Form Submission**: Visitors can submit messages through the contact form
2. **Database Storage**: Messages are stored in a dedicated database table
3. **Role-Based Access**: Only staff and admin users can view messages
4. **Message Management**: Staff can update message status and add notes
5. **Admin Controls**: Admin users can delete messages

## Implementation Details

### Database Schema

The feature uses a `contact_messages` table with the following structure:

- `id`: Primary key
- `name`: Visitor's name
- `email`: Visitor's email
- `company`: Visitor's company (optional)
- `phone`: Visitor's phone number (optional)
- `inquiry_type`: Type of inquiry
- `message`: The actual message content
- `newsletter`: Boolean indicating if visitor wants newsletter
- `status`: Message status (unread, read, replied)
- `replied_at`: Timestamp when message was replied to
- `replied_by`: User ID of staff member who replied
- `notes`: Internal notes for staff/admin
- `created_at`: Timestamp when message was created
- `updated_at`: Timestamp when message was last updated

### API Routes

1. `POST /api/contact-messages` - Submit a new contact message
2. `GET /api/contact-messages` - Fetch all contact messages (staff/admin only)
3. `GET /api/contact-messages/count` - Get count of unread messages (staff/admin only)
4. `PATCH /api/contact-messages/:id` - Update message status/notes (staff/admin only)
5. `DELETE /api/contact-messages/:id` - Delete a message (admin only)

### Frontend Components

1. `ContactForm` - Updated to submit messages to the database
2. `ContactMessagesDashboard` - Dashboard for viewing and managing messages
3. `ContactMessagesPage` - Dedicated page for message management
4. `useContactMessages` - Hook for handling contact message operations
5. `useContactMessagesCount` - Hook for fetching unread message count

### Access Control

- **Public**: Anyone can submit messages through the contact form
- **Staff/Admin**: Can view, update status, and add notes to messages
- **Admin Only**: Can delete messages

## Usage

1. Visitors submit messages through the contact form on the contact page
2. Messages are stored in the database with "unread" status
3. Staff and admin users can view messages in the Staff Panel or Contact Messages page
4. Users can update message status and add internal notes
5. Admin users can delete messages when no longer needed

## Security

- All API routes implement proper authentication and authorization checks
- Row Level Security (RLS) policies ensure only authorized users can access messages
- Messages are only accessible to authenticated staff and admin users