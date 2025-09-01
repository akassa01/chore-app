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
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    if (isLate(assignment)) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
    return <Clock className="h-5 w-5 text-yellow-500" />
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
      return 'text-green-600 bg-green-50 border-green-200'
    }
    if (isLate(assignment)) {
      return 'text-red-600 bg-red-50 border-red-200'
    }
    return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }

  const completedSubtasks = assignment.subtasks_completed?.length || 0
  const totalSubtasks = assignment.chore.subtasks.length
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  return (
    <Card className={`transition-all duration-200 hover:shadow-md theme-card ${
      isLate(assignment) ? 'border-red-200 bg-red-50/50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg theme-text">{assignment.chore.name}</CardTitle>
            <CardDescription className="theme-muted">
              Assigned to {assignment.user.name}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium px-2 py-1 rounded-full border ${getStatusColor()}`}>
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
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="theme-primary-bg h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Subtasks preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium theme-text">Subtasks</h4>
            {isOwnChore && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChecklist(!showChecklist)}
                className="theme-border"
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
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
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
              <AlertTriangle className="h-4 w-4 text-red-500" />
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
