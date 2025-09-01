'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, User } from '@/lib/supabaseClient'
import { useTheme } from './ThemeProvider'

interface UserSelectProps {
  onUserSelect: (user: User) => void
}

export default function UserSelect({ onUserSelect }: UserSelectProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { currentTheme } = useTheme()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('chore-app-user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      onUserSelect(user)
      router.push('/dashboard')
      return
    }

    // Load users from database
    loadUsers()
  }, [onUserSelect, router])

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

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
  }

  const handleLogin = () => {
    if (!selectedUserId) return

    const selectedUser = users.find(user => user.id === selectedUserId)
    if (selectedUser) {
      // Save to localStorage
      localStorage.setItem('chore-app-user', JSON.stringify(selectedUser))
      onUserSelect(selectedUser)
      router.push('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-4xl">{currentTheme?.logo}</span>
            <div>
              <CardTitle className="text-2xl">Welcome to Chore Tracker</CardTitle>
              <CardDescription>
                {currentTheme?.description || 'Select your name to get started'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedUserId} onValueChange={handleUserSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your name" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleLogin} 
            disabled={!selectedUserId}
            className="w-full"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
