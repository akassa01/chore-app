'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Star, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { supabase, AssignmentWithDetails, User, Rating } from '../../lib/supabaseClient'
import { getCurrentWeekStart, isQualityCheckDay } from '../../lib/dates'
import Navbar from '../../components/Navbar'
import { ThemeProvider, useTheme } from '../../components/ThemeProvider'

function QualityCheckContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const { currentTheme } = useTheme()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('chore-app-user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      loadData(user)
    } else {
      // Redirect to login if no user
      window.location.href = '/'
    }
  }, [])

  const loadData = async (user: User) => {
    try {
      // Load completed assignments from last week
      const lastWeekStart = new Date(getCurrentWeekStart())
      lastWeekStart.setDate(lastWeekStart.getDate() - 7)
      const lastWeekStartStr = lastWeekStart.toISOString().split('T')[0]

      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          user:users(*),
          chore:chores(*)
        `)
        .eq('week_start_date', lastWeekStartStr)
        .eq('completed', true)
        .neq('user_id', user.id) // Don't show own completed chores

      if (assignmentsError) throw assignmentsError

      // Load existing ratings
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('rater_id', user.id)
        .eq('week_start_date', lastWeekStartStr)

      if (ratingsError) throw ratingsError

      setAssignments(assignmentsData || [])
      setRatings(ratingsData || [])
    } catch (error) {
      console.error('Error loading quality check data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRating = async (assignmentId: string, rating: number) => {
    if (submitting || !currentUser) return

    setSubmitting(assignmentId)
    try {
      const assignment = assignments.find(a => a.id === assignmentId)
      if (!assignment) return

      const lastWeekStart = new Date(getCurrentWeekStart())
      lastWeekStart.setDate(lastWeekStart.getDate() - 7)
      const lastWeekStartStr = lastWeekStart.toISOString().split('T')[0]

      // Check if rating already exists
      const existingRating = ratings.find(r => 
        r.ratee_id === assignment.user_id && 
        r.chore_id === assignment.chore_id &&
        r.week_start_date === lastWeekStartStr
      )

      if (existingRating) {
        // Update existing rating
        const { error } = await supabase
          .from('ratings')
          .update({ rating })
          .eq('id', existingRating.id)

        if (error) throw error

        setRatings(prev => 
          prev.map(r => 
            r.id === existingRating.id 
              ? { ...r, rating }
              : r
          )
        )
      } else {
        // Create new rating
        const { data, error } = await supabase
          .from('ratings')
          .insert({
            rater_id: currentUser.id,
            ratee_id: assignment.user_id,
            chore_id: assignment.chore_id,
            week_start_date: lastWeekStartStr,
            rating
          })
          .select()
          .single()

        if (error) throw error

        setRatings(prev => [...prev, data])
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setSubmitting(null)
    }
  }

  const getRatingForAssignment = (assignment: AssignmentWithDetails) => {
    const lastWeekStart = new Date(getCurrentWeekStart())
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)
    const lastWeekStartStr = lastWeekStart.toISOString().split('T')[0]

    return ratings.find(r => 
      r.ratee_id === assignment.user_id && 
      r.chore_id === assignment.chore_id &&
      r.week_start_date === lastWeekStartStr
    )?.rating || 0
  }

  const handleLogout = () => {
    localStorage.removeItem('chore-app-user')
    window.location.href = '/'
  }

  const isQualityCheckAvailable = isQualityCheckDay()

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 theme-muted">Loading quality check...</p>
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
            <h1 className="text-3xl font-bold theme-welcome-text">Quality Check</h1>
            <p className="theme-welcome-description">
              Rate how well your housemates completed their chores last week
            </p>
          </div>
        </div>

        {/* Availability Notice */}
        {!isQualityCheckAvailable && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <h3 className="font-medium text-yellow-800">Quality Check Available on Mondays</h3>
                  <p className="text-sm text-yellow-600">
                    You can only rate chore completion quality on Mondays. Come back then!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {isQualityCheckAvailable && (
          <Card className="mb-6 card-theme">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 theme-card-title">
                <Star className="h-5 w-5" />
                <span>How to Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2].map(star => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="theme-text">Poor - Not done properly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map(star => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="theme-text">Good - Adequately done</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="theme-text">Excellent - Well done!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Chores to Rate */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold theme-section-title">Rate Last Week's Completed Chores</h2>
          
          {assignments.length === 0 ? (
            <Card className="card-theme">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 theme-completed mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2 theme-card-title">No chores to rate!</h3>
                  <p className="theme-card-description mb-4">
                    All completed chores from last week have already been rated or there were no completed chores.
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
            assignments.map((assignment) => {
              const currentRating = getRatingForAssignment(assignment)
              const isSubmitting = submitting === assignment.id

              return (
                <Card key={assignment.id} className="card-theme">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg theme-card-title">{assignment.chore.name}</CardTitle>
                        <CardDescription className="theme-card-description">
                          Completed by {assignment.user.name} last week
                        </CardDescription>
                      </div>
                      <div className="text-sm theme-muted">
                        {assignment.chore.subtasks.length} subtasks completed
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Subtasks completed */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 theme-card-title">Completed subtasks:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {assignment.chore.subtasks.map((subtask, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 theme-completed" />
                              <span className="theme-text">{subtask}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rating */}
                      {isQualityCheckAvailable && (
                        <div>
                          <h4 className="text-sm font-medium mb-3 theme-card-title">Rate the quality:</h4>
                          <div className="flex items-center space-x-4">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => handleRating(assignment.id, star)}
                                  disabled={isSubmitting}
                                  className={`p-1 rounded transition-colors ${
                                    currentRating >= star
                                      ? 'text-yellow-400 hover:text-yellow-500'
                                      : 'text-gray-300 hover:text-gray-400'
                                  }`}
                                >
                                  <Star className="h-6 w-6 fill-current" />
                                </button>
                              ))}
                            </div>
                            <span className="text-sm theme-muted">
                              {currentRating > 0 ? `${currentRating}/5 stars` : 'Not rated yet'}
                            </span>
                            {isSubmitting && (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Summary */}
        {isQualityCheckAvailable && assignments.length > 0 && (
          <Card className="mt-8 card-theme">
            <CardHeader>
              <CardTitle className="theme-card-title">Rating Summary</CardTitle>
              <CardDescription className="theme-card-description">
                Your ratings for last week's completed chores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="theme-card-title">Chores rated:</span>
                  <span className="font-medium theme-text">{ratings.length} of {assignments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="theme-card-title">Average rating:</span>
                  <span className="font-medium theme-text">
                    {ratings.length > 0 
                      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
                      : '0'
                    }/5
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function QualityCheckPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('chore-app-user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <ThemeProvider currentUser={currentUser}>
      <QualityCheckContent />
    </ThemeProvider>
  )
}
