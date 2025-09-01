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
            <div className="loading-spinner rounded-full h-12 w-12 mx-auto mb-4"></div>
            <p className="mt-2 theme-muted text-lg">Loading your dashboard...</p>
            <div className="mt-4 space-y-2">
              <div className="h-2 bg-gray-200 rounded-full w-48 mx-auto">
                <div className="progress-bar h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Personalized Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-5xl">{currentTheme?.logo}</span>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold theme-welcome-text">
                Welcome, {currentUser.name}! {currentTheme?.welcomeEmoji || '✨'}
              </h1>
              <p className="theme-welcome-description">{currentTheme?.description}</p>
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

        {/* Enhanced Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="stats-card">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <CardTitle className="text-lg theme-card-title">My Chores</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold theme-stats-value mb-1">{totalChores}</div>
              <p className="text-sm theme-stats-label">
                Assigned this week 📋
              </p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-lg theme-card-title">Completed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold theme-completed mb-1">
                {completedChores}
              </div>
              <p className="text-sm theme-stats-label">
                {totalChores > 0 ? `${Math.round((completedChores / totalChores) * 100)}% done` : 'No chores assigned'} 🎉
              </p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-lg theme-card-title">Pending</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold theme-pending mb-1">{totalChores - completedChores}</div>
              <p className="text-sm theme-stats-label">
                Due by Sunday 11:59 PM ⏰
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My Chores Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold section-title">My Chores This Week</h2>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/chores'}
              className="btn-theme-outline"
            >
              View All
            </Button>
          </div>
          
          {myChores.length === 0 ? (
            <Card className="empty-state">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 theme-completed mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 theme-card-title">No chores assigned! 🎉</h3>
                  <p className="theme-card-description">
                    You're all caught up for this week. Enjoy your free time!
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
          <h2 className="text-2xl font-bold mb-6 section-title">All House Chores</h2>
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
