import { supabase } from './supabaseClient'
import { UserRole } from './roles'

export interface AdminApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

class AdminApiClient {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No valid session found. Please log in again.')
    }
    
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<AdminApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders()
      
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`
        }
      }

      return {
        success: true,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred'
      }
    }
  }

  async getUsers() {
    return this.makeRequest<{ users: any[] }>('/api/admin/users', {
      method: 'GET'
    })
  }

  async updateUserRole(userId: string, role: UserRole) {
    return this.makeRequest('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ userId, role })
    })
  }
}

export const adminApi = new AdminApiClient()