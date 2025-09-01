'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, AlertTriangle, Clock } from 'lucide-react'
import { AssignmentWithDetails } from '@/lib/supabaseClient'
import { isLate } from '@/lib/dates'
import { formatDate } from '@/lib/dates'
import Checklist from './Checklist'

interface ChoreCardProps {
  assignment: AssignmentWithDetails
  onUpdate: (assignmentId: string, updates: Partial<AssignmentWithDetails>) => void
  isOwnChore: boolean
}

export default function ChoreCard({ assignment, onUpdate, isOwnChore }: ChoreCardProps) {
  const [showChecklist, setShowChecklist] = useState(false)

  const getStatusIcon = () => {
    if (assignment.completed) {
      return <CheckCircle className="h-5 w-5 theme-completed" />
    }
    if (isLate(assignment)) {
      return <AlertTriangle className="h-5 w-5 theme-late" />
    }
    return <Clock className="h-5 w-5 theme-pending" />
  }

  const getStatusText = () => {
    if (assignment.completed) {
      return 'Completed'
    }
    if (isLate(assignment)) {
      return 'Late'
    }
    return 'Pending'
  }

  const getStatusColor = () => {
    if (assignment.completed) {
      return 'theme-completed bg-green-50 border-green-200'
    }
    if (isLate(assignment)) {
      return 'theme-late bg-red-50 border-red-200'
    }
    return 'theme-pending bg-yellow-50 border-yellow-200'
  }

  const completedSubtasks = assignment.subtasks_completed?.length || 0
  const totalSubtasks = assignment.chore.subtasks.length
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  return (
    <Card className={`card-theme transition-all duration-200 hover:shadow-md ${
      isLate(assignment) ? 'border-red-200 bg-red-50/50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg theme-card-title">{assignment.chore.name}</CardTitle>
            <CardDescription className="theme-card-description">
              Assigned to {assignment.user.name}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`status-badge ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="theme-muted">Progress</span>
            <span className="font-medium theme-text">
              {completedSubtasks} of {totalSubtasks} subtasks
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="progress-bar h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Subtasks preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium theme-card-title">Subtasks</h4>
            {isOwnChore && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChecklist(!showChecklist)}
                className="btn-theme-outline"
              >
                {showChecklist ? 'Hide' : 'Manage'}
              </Button>
            )}
          </div>
          
          <div className="space-y-1">
            {assignment.chore.subtasks.slice(0, 3).map((subtask, index) => {
              const isCompleted = assignment.subtasks_completed?.includes(subtask)
              return (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 theme-completed" />
                  ) : (
                    <Circle className="h-4 w-4 theme-muted" />
                  )}
                  <span className={`${isCompleted ? 'line-through theme-muted' : 'theme-text'}`}>
                    {subtask}
                  </span>
                </div>
              )
            })}
            {assignment.chore.subtasks.length > 3 && (
              <div className="text-sm theme-muted">
                +{assignment.chore.subtasks.length - 3} more...
              </div>
            )}
          </div>
        </div>

        {/* Checklist for own chores */}
        {isOwnChore && showChecklist && (
          <Checklist
            assignment={assignment}
            onUpdate={onUpdate}
          />
        )}

        {/* Late warning */}
        {isLate(assignment) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 theme-late" />
              <span className="text-sm font-medium text-red-700">
                This chore is overdue! Please complete it as soon as possible.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
