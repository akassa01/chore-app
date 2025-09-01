'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User } from '@/lib/supabaseClient'
import { LogOut, Home, CheckSquare, Star } from 'lucide-react'

interface NavbarProps {
  currentUser: User
  onLogout: () => void
}

export default function Navbar({ currentUser, onLogout }: NavbarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('chore-app-user')
    onLogout()
    router.push('/')
  }

  return (
    <nav className="theme-background theme-border border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold theme-text">Chore Tracker</h1>
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-1 theme-text hover:theme-accent"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/chores')}
                className="flex items-center space-x-1 theme-text hover:theme-accent"
              >
                <CheckSquare className="h-4 w-4" />
                <span>My Chores</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/quality-check')}
                className="flex items-center space-x-1 theme-text hover:theme-accent"
              >
                <Star className="h-4 w-4" />
                <span>Quality Check</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm theme-muted">
              Welcome, {currentUser.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1 theme-border"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden theme-border border-t">
        <div className="flex justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="flex flex-col items-center space-y-1 theme-text hover:theme-accent"
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/chores')}
            className="flex flex-col items-center space-y-1 theme-text hover:theme-accent"
          >
            <CheckSquare className="h-4 w-4" />
            <span className="text-xs">Chores</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/quality-check')}
            className="flex flex-col items-center space-y-1 theme-text hover:theme-accent"
          >
            <Star className="h-4 w-4" />
            <span className="text-xs">Quality</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
