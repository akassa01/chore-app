'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { AlertTriangle, CheckCircle, Clock, ArrowLeft } from 'lucide-react'
import { supabase, AssignmentWithDetails, User } from '../../lib/supabaseClient'
import { getCurrentWeekStart, isLate } from '../../lib/dates'
import Navbar from '../../components/Navbar'
import ChoreCard from '../../components/ChoreCard'
import { ThemeProvider, useTheme } from '../../components/ThemeProvider'

function ChoresContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
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
        .eq('user_id', user.id)

      if (error) throw error

      setAssignments(data || [])
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

  const completedChores = assignments.filter(a => a.completed).length
  const totalChores = assignments.length
  const lateChores = assignments.filter(a => isLate(a)).length

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 theme-muted">Loading chores...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 btn-theme-outline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold theme-welcome-text">My Chores</h1>
            <p className="theme-welcome-description">
              Manage your weekly chore assignments
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-theme">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg theme-card-title">Total Chores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold theme-stats-value">{totalChores}</div>
              <p className="text-sm theme-stats-label">
                Assigned this week
              </p>
            </CardContent>
          </Card>

          <Card className="card-theme">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg theme-card-title">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold theme-completed">{completedChores}</div>
              <p className="text-sm theme-stats-label">
                {totalChores > 0 ? `${Math.round((completedChores / totalChores) * 100)}% done` : 'No chores'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-theme">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg theme-card-title">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold theme-pending">{totalChores - completedChores}</div>
              <p className="text-sm theme-stats-label">
                Due by Sunday 11:59 PM
              </p>
            </CardContent>
          </Card>

          <Card className="card-theme">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg theme-card-title">Late</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold theme-late">{lateChores}</div>
              <p className="text-sm theme-stats-label">
                Overdue chores
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Late Warning */}
        {lateChores > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 theme-late" />
                <div>
                  <h3 className="font-medium text-red-800">
                    You have {lateChores} overdue chore{lateChores > 1 ? 's' : ''}!
                  </h3>
                  <p className="text-sm text-red-600">
                    Please complete these as soon as possible to avoid penalties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chores List */}
        <div className="space-y-6">
          {assignments.length === 0 ? (
            <Card className="card-theme">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 theme-completed mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2 theme-card-title">No chores assigned!</h3>
                  <p className="theme-card-description mb-4">
                    You're all caught up for this week. Enjoy your free time!
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard'}
                    className="btn-theme-outline"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => (
              <ChoreCard
                key={assignment.id}
                assignment={assignment}
                onUpdate={handleAssignmentUpdate}
                isOwnChore={true}
              />
            ))
          )}
        </div>

        {/* Progress Summary */}
        {assignments.length > 0 && (
          <Card className="mt-8 card-theme">
            <CardHeader>
              <CardTitle className="theme-card-title">Weekly Progress</CardTitle>
              <CardDescription className="theme-card-description">
                Your completion status for this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium theme-card-title">Overall Progress</span>
                  <span className="text-sm theme-muted">
                    {completedChores} of {totalChores} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="theme-primary-bg h-3 rounded-full transition-all duration-300"
                    style={{ width: `${totalChores > 0 ? (completedChores / totalChores) * 100 : 0}%` }}
                  />
                </div>
                <div className="text-sm theme-muted">
                  {totalChores > 0 && completedChores < totalChores && (
                    <span>
                      {totalChores - completedChores} chore{totalChores - completedChores > 1 ? 's' : ''} remaining
                    </span>
                  )}
                  {completedChores === totalChores && totalChores > 0 && (
                    <span className="theme-completed font-medium">
                      🎉 All chores completed! Great job!
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ChoresPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('chore-app-user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <ThemeProvider currentUser={currentUser}>
      <ChoresContent />
    </ThemeProvider>
  )
}
