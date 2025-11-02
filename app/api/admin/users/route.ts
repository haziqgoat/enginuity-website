import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { UserRole } from '@/lib/roles'

// Create Supabase admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key (server-side only)
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Verify if the requesting user is an admin
async function verifyAdminUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return null
    }

    // Check if user has admin role
    const userRole = user.user_metadata?.role
    if (userRole !== UserRole.ADMIN) {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await verifyAdminUser(request)
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    // Fetch all users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Add default role for users without one
    const usersWithRoles = data.users.map(user => ({
      ...user,
      user_metadata: {
        ...user.user_metadata,
        role: user.user_metadata?.role || UserRole.CLIENT
      }
    }))

    return NextResponse.json({ users: usersWithRoles })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/users - Update user role
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await verifyAdminUser(request)
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    const { userId, role } = await request.json()
    
    // Validate input
    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 })
    }

    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Prevent admin from changing their own role
    if (userId === adminUser.id) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
    }

    // Get current user data
    const { data: currentUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (getUserError || !currentUser.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user role
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...currentUser.user.user_metadata,
        role: role
      }
    })
    
    if (error) {
      console.error('Error updating user role:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        ...data.user,
        user_metadata: {
          ...data.user?.user_metadata,
          role: role
        }
      }
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}