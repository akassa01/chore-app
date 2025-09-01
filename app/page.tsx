'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/supabaseClient'
import PhotoUserSelect from '@/components/PhotoUserSelect'
import { ThemeProvider } from '@/components/ThemeProvider'

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('chore-app-user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      // Redirect to dashboard if user is logged in
      window.location.href = '/dashboard'
      return
    }
    setLoading(false)
  }, [])

  const handleUserSelect = (user: User) => {
    setCurrentUser(user)
    // Redirect to dashboard after login
    window.location.href = '/dashboard'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="loading-spinner rounded-full h-12 w-12 mx-auto mb-4"></div>
          <p className="mt-2 theme-muted text-lg">Loading your app...</p>
          <div className="mt-4 space-y-2">
            <div className="h-2 bg-gray-200 rounded-full w-48 mx-auto">
              <div className="progress-bar h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider currentUser={currentUser}>
      <PhotoUserSelect onUserSelect={handleUserSelect} />
    </ThemeProvider>
  )
}
