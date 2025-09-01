'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, User } from '@/lib/supabaseClient'
import { useTheme } from './ThemeProvider'

interface PhotoUserSelectProps {
  onUserSelect: (user: User) => void
}

export default function PhotoUserSelect({ onUserSelect }: PhotoUserSelectProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { currentTheme } = useTheme()

  // Photo mapping based on alphabetical order
  const photoMapping = ['user1.jpeg', 'user2.jpeg', 'user3.jpeg', 'user4.jpeg']

  useEffect(() => {
    // Load users from database
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name')

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  const handleLogin = () => {
    if (!selectedUser) return

    // Save to localStorage
    localStorage.setItem('chore-app-user', JSON.stringify(selectedUser))
    onUserSelect(selectedUser)
    router.push('/dashboard')
  }

  const getUserPhoto = (userIndex: number) => {
    return photoMapping[userIndex] || 'user1.jpeg' // fallback to first photo
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 theme-muted">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-2xl card-theme">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="text-4xl">{currentTheme?.logo}</span>
            <div>
              <CardTitle className="text-3xl theme-welcome-text">Welcome to Chore Tracker</CardTitle>
              <CardDescription className="text-lg theme-welcome-description">
                {currentTheme?.description || 'Select your photo to get started'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedUser?.id === user.id
                    ? 'scale-105 ring-4 ring-primary ring-offset-2'
                    : 'hover:scale-102 hover:ring-2 hover:ring-muted'
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-accent">
                  <img
                    src={`/avatars/${getUserPhoto(index)}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/avatars/user1.jpeg'
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 rounded-b-lg">
                  <p className="text-sm font-medium text-center truncate">{user.name}</p>
                </div>
                {selectedUser?.id === user.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button 
              onClick={handleLogin} 
              disabled={!selectedUser}
              className="w-full max-w-xs text-lg py-3 btn-theme-primary"
              size="lg"
            >
              {selectedUser ? `Continue as ${selectedUser.name}` : 'Select your photo'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
