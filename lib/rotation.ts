import { supabase } from './supabaseClient'
import { getCurrentWeekStart, getNextWeekStart } from './dates'

export async function rotateChores() {
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .order('id')

    if (usersError) throw usersError

    // Get all chores
    const { data: chores, error: choresError } = await supabase
      .from('chores')
      .select('id, name')
      .order('id')

    if (choresError) throw choresError

    if (!users || !chores || users.length === 0 || chores.length === 0) {
      throw new Error('No users or chores found')
    }

    // Get current assignments to determine rotation
    const { data: currentAssignments, error: currentError } = await supabase
      .from('assignments')
      .select('user_id, chore_id')
      .eq('week_start_date', getCurrentWeekStart())

    if (currentError) throw currentError

    // Create a map of current assignments
    const currentMap = new Map<string, string>()
    currentAssignments?.forEach(assignment => {
      currentMap.set(assignment.chore_id, assignment.user_id)
    })

    // Calculate new assignments
    const newAssignments = []
    const nextWeekStart = getNextWeekStart()

    for (const chore of chores) {
      const currentUserId = currentMap.get(chore.id)
      if (!currentUserId) continue

      // Find current user index
      const currentUserIndex = users.findIndex(user => user.id === currentUserId)
      if (currentUserIndex === -1) continue

      // Calculate next user (rotate by 1)
      const nextUserIndex = (currentUserIndex + 1) % users.length
      const nextUserId = users[nextUserIndex].id

      newAssignments.push({
        user_id: nextUserId,
        chore_id: chore.id,
        week_start_date: nextWeekStart,
        completed: false,
        late: false,
        subtasks_completed: []
      })
    }

    // Insert new assignments
    if (newAssignments.length > 0) {
      const { error: insertError } = await supabase
        .from('assignments')
        .insert(newAssignments)

      if (insertError) throw insertError
    }

    return { success: true, assignments: newAssignments }
  } catch (error) {
    console.error('Error rotating chores:', error)
    return { success: false, error }
  }
}

export async function markLateChores() {
  try {
    const { error } = await supabase
      .from('assignments')
      .update({ late: true })
      .eq('week_start_date', getCurrentWeekStart())
      .eq('completed', false)
      .eq('late', false)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error marking late chores:', error)
    return { success: false, error }
  }
}
