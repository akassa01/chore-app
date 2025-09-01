'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { supabase, AssignmentWithDetails, User } from '../../lib/supabaseClient'
import { getCurrentWeekStart, isLate } from '../../lib/dates'
import Navbar from '../../components/Navbar'
import ChoreCard from '../../components/ChoreCard'
import { ThemeProvider, useTheme } from '../../components/ThemeProvider'

function DashboardContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [lateWarning, setLateWarning] = useState(false)
  const { currentTheme } = useTheme()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('chore-app-user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      loadAssignments(user)
    } else {
      // Redirect to login if no user
      window.location.href = '/'
    }
  }, [])

  const loadAssignments = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          user:users(*),
          chore:chores(*)
        `)
        .eq('week_start_date', getCurrentWeekStart())
        .order('created_at')

      if (error) throw error

      setAssignments(data || [])
      
      // Check for late chores
      const hasLateChores = data?.some(assignment => 
        assignment.user_id === user.id && isLate(assignment)
      )
      setLateWarning(hasLateChores || false)
    } catch (error) {
      console.error('Error loading assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignmentUpdate = (assignmentId: string, updates: Partial<AssignmentWithDetails>) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, ...updates }
          : assignment
      )
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('chore-app-user')
    window.location.href = '/'
  }

  const myChores = assignments.filter(a => a.user_id === currentUser?.id)
  const otherChores = assignments.filter(a => a.user_id !== currentUser?.id)
  const completedChores = myChores.filter(a => a.completed).length
  const totalChores = myChores.length

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personalized Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-4xl">{currentTheme?.logo}</span>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome, {currentUser.name}!
              </h1>
              <p className="text-muted-foreground">{currentTheme?.description}</p>
            </div>
          </div>
        </div>

        {/* Late Warning */}
        {lateWarning && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <h3 className="font-medium text-red-800">You have overdue chores!</h3>
                  <p className="text-sm text-red-600">
                    Please complete your late chores as soon as possible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Chores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalChores}</div>
              <p className="text-sm text-muted-foreground">
                Assigned this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedChores}</div>
              <p className="text-sm text-muted-foreground">
                {totalChores > 0 ? `${Math.round((completedChores / totalChores) * 100)}% done` : 'No chores assigned'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{totalChores - completedChores}</div>
              <p className="text-sm text-muted-foreground">
                Due by Sunday 11:59 PM
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My Chores Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">My Chores This Week</h2>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/chores'}
            >
              View All
            </Button>
          </div>
          
          {myChores.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-foreground">No chores assigned!</h3>
                  <p className="text-muted-foreground">
                    You're all caught up for this week.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myChores.map((assignment) => (
                <ChoreCard
                  key={assignment.id}
                  assignment={assignment}
                  onUpdate={handleAssignmentUpdate}
                  isOwnChore={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* All House Chores Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">All House Chores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <ChoreCard
                key={assignment.id}
                assignment={assignment}
                onUpdate={handleAssignmentUpdate}
                isOwnChore={assignment.user_id === currentUser.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('chore-app-user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <ThemeProvider currentUser={currentUser}>
      <DashboardContent />
    </ThemeProvider>
  )
}
