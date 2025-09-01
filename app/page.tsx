'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/supabaseClient'
import UserSelect from '@/components/UserSelect'

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <UserSelect onUserSelect={handleUserSelect} />
}
