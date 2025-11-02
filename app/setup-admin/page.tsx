"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { UserRole } from "@/lib/roles"
import { supabase } from "@/lib/supabaseClient"

export default function SetupAdminPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const { user, isAuthenticated } = useAuth()

  const makeUserAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Check if the email matches the current user
      if (!isAuthenticated) {
        throw new Error("You must be logged in to use this feature")
      }

      if (user?.email !== email) {
        throw new Error("You can only make yourself an admin. Please enter your current email address.")
      }

      // Update the current user's role to admin
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          role: UserRole.ADMIN
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      setMessage({ 
        type: 'success', 
        text: 'Successfully upgraded to admin! Please refresh the page to see admin features.' 
      })
      
      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-orange-800">
              Admin Setup
            </CardTitle>
            <CardDescription className="text-orange-700">
              One-time setup to create your first admin account. 
              <br />
              <strong>Warning:</strong> This should only be used by the site owner.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!isAuthenticated ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You must be logged in to use the admin setup. Please <a href="/login" className="underline">login</a> first.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert className="mb-6 border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Instructions:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Enter your email address (the one you're currently logged in with)</li>
                      <li>Click "Make Me Admin" to upgrade your account</li>
                      <li>Refresh the page to see admin features</li>
                      <li>Delete this page after setup for security</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <form onSubmit={makeUserAdmin} className="space-y-4">
                  {message && (
                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'} 
                           className={message.type === 'success' ? 'border-green-200 bg-green-50' : ''}>
                      {message.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription className={message.type === 'success' ? 'text-green-800' : ''}>
                        {message.text}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email (must match your login)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-sm text-gray-600">
                      Currently logged in as: <strong>{user?.email}</strong>
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up admin...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Make Me Admin
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Security Notice:</h3>
                  <p className="text-sm text-red-700">
                    After creating your admin account, you should delete this setup page by removing the 
                    <code className="bg-red-100 px-1 rounded">/app/setup-admin/</code> folder to prevent unauthorized access.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}