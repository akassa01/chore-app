'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle } from 'lucide-react'
import { AssignmentWithDetails } from '@/lib/supabaseClient'
import { supabase } from '@/lib/supabaseClient'

interface ChecklistProps {
  assignment: AssignmentWithDetails
  onUpdate: (assignmentId: string, updates: Partial<AssignmentWithDetails>) => void
}

export default function Checklist({ assignment, onUpdate }: ChecklistProps) {
  const [updating, setUpdating] = useState<string | null>(null)

  const handleSubtaskToggle = async (subtask: string) => {
    if (updating) return

    setUpdating(subtask)
    try {
      const currentCompleted = assignment.subtasks_completed || []
      const newCompleted = currentCompleted.includes(subtask)
        ? currentCompleted.filter(s => s !== subtask)
        : [...currentCompleted, subtask]

      // Update in database
      const { error } = await supabase
        .from('assignments')
        .update({ 
          subtasks_completed: newCompleted,
          completed: newCompleted.length === assignment.chore.subtasks.length
        })
        .eq('id', assignment.id)

      if (error) throw error

      // Update local state
      onUpdate(assignment.id, {
        subtasks_completed: newCompleted,
        completed: newCompleted.length === assignment.chore.subtasks.length
      })
    } catch (error) {
      console.error('Error updating subtask:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleCompleteAll = async () => {
    if (updating) return

    setUpdating('all')
    try {
      const allSubtasks = assignment.chore.subtasks

      const { error } = await supabase
        .from('assignments')
        .update({ 
          subtasks_completed: allSubtasks,
          completed: true
        })
        .eq('id', assignment.id)

      if (error) throw error

      onUpdate(assignment.id, {
        subtasks_completed: allSubtasks,
        completed: true
      })
    } catch (error) {
      console.error('Error completing all subtasks:', error)
    } finally {
      setUpdating(null)
    }
  }

  const handleUncompleteAll = async () => {
    if (updating) return

    setUpdating('all')
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ 
          subtasks_completed: [],
          completed: false
        })
        .eq('id', assignment.id)

      if (error) throw error

      onUpdate(assignment.id, {
        subtasks_completed: [],
        completed: false
      })
    } catch (error) {
      console.error('Error uncompleting all subtasks:', error)
    } finally {
      setUpdating(null)
    }
  }

  const completedCount = assignment.subtasks_completed?.length || 0
  const totalCount = assignment.chore.subtasks.length
  const allCompleted = completedCount === totalCount

  return (
    <div className="border-t pt-4 space-y-4 border-border">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Manage Subtasks</h4>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompleteAll}
            disabled={updating !== null || allCompleted}
          >
            Complete All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUncompleteAll}
            disabled={updating !== null || completedCount === 0}
          >
            Reset All
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {assignment.chore.subtasks.map((subtask, index) => {
          const isCompleted = assignment.subtasks_completed?.includes(subtask)
          const isUpdating = updating === subtask

          return (
            <div
              key={index}
              className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                isCompleted ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => handleSubtaskToggle(subtask)}
                disabled={isUpdating}
                className="mt-0"
              />
              <span
                className={`flex-1 text-sm ${
                  isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}
              >
                {subtask}
              </span>
              {isUpdating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </div>
          )
        })}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {completedCount} of {totalCount} subtasks completed
      </div>
    </div>
  )
}
