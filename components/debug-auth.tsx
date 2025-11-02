"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/use-auth'

export function DebugAuth() {
  const { user, isAuthenticated } = useAuth()
  const [authInfo, setAuthInfo] = useState<any>(null)
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession()
        
        // Get current user
        const { data: userData } = await supabase.auth.getUser()
        
        setAuthInfo({
          session: sessionData.session,
          user: userData.user,
          isAuthenticated,
          userFromHook: user
        })
      } catch (error: any) {
        console.error('Auth debug error:', error)
        setAuthInfo({ error: error.message })
      }
    }
    
    checkAuth()
  }, [user, isAuthenticated])

  const testStorageAccess = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('profiles')
        .list('', { limit: 1 })
      
      const result = { success: !error, data, error: error?.message }
      setTestResults(prev => ({ ...prev, storageList: result }))
      console.log('Storage list test:', result)
    } catch (error: any) {
      const result = { success: false, error: error.message }
      setTestResults(prev => ({ ...prev, storageList: result }))
      console.error('Storage list error:', error)
    }
  }

  const testFileUpload = async () => {
    if (!user?.id) {
      alert('No user ID available for test')
      return
    }

    try {
      // Create a tiny test file
      const testContent = 'test'
      const testFile = new File([testContent], 'test.txt', { type: 'text/plain' })
      const fileName = `${user.id}/test-upload.txt`
      
      console.log('Testing upload to:', fileName)
      
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, testFile, {
          cacheControl: '3600',
          upsert: true
        })
      
      const result = { success: !error, data, error: error?.message, fileName }
      setTestResults(prev => ({ ...prev, testUpload: result }))
      console.log('Upload test result:', result)
      
      if (result.success) {
        // Clean up test file
        await supabase.storage.from('profiles').remove([fileName])
        alert('✅ Upload test PASSED! Your authentication is working.')
      } else {
        alert(`❌ Upload test FAILED: ${result.error}`)
      }
    } catch (error: any) {
      const result = { success: false, error: error.message }
      setTestResults(prev => ({ ...prev, testUpload: result }))
      console.error('Upload test error:', error)
      alert(`❌ Upload test ERROR: ${error.message}`)
    }
  }

  const checkBucketExists = async () => {
    try {
      const { data, error } = await supabase.storage.getBucket('profiles')
      const result = { success: !error, data, error: error?.message }
      setTestResults(prev => ({ ...prev, bucketCheck: result }))
      console.log('Bucket check:', result)
    } catch (error: any) {
      const result = { success: false, error: error.message }
      setTestResults(prev => ({ ...prev, bucketCheck: result }))
      console.error('Bucket check error:', error)
    }
  }

  if (!authInfo) {
    return <div>Loading auth debug info...</div>
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 font-mono text-sm">
      <h3 className="font-bold mb-4">🔍 Enhanced Authentication Debug</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>User ID:</strong> {user?.id || '❌ None'}
          </div>
          <div>
            <strong>Email:</strong> {user?.email || '❌ None'}
          </div>
          <div>
            <strong>Role:</strong> {user?.user_metadata?.role || '❌ None'}
          </div>
          <div>
            <strong>Session Exists:</strong> {authInfo.session ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>Access Token:</strong> {authInfo.session?.access_token ? '✅ Present' : '❌ Missing'}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={testStorageAccess}
            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
          >
            Test Storage List
          </button>
          <button 
            onClick={testFileUpload}
            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
          >
            Test File Upload
          </button>
          <button 
            onClick={checkBucketExists}
            className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600"
          >
            Check Bucket
          </button>
        </div>
        
        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="mt-4 p-3 bg-white border rounded">
            <strong>Test Results:</strong>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
        
        <details className="mt-4">
          <summary className="cursor-pointer font-bold">Full Auth Object (Click to expand)</summary>
          <pre className="mt-2 p-2 bg-white border rounded overflow-auto text-xs">
            {JSON.stringify(authInfo, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}