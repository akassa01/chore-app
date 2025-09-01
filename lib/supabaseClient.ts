import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
}

export interface Chore {
  id: string
  name: string
  subtasks: string[]
}

export interface Assignment {
  id: string
  user_id: string
  chore_id: string
  week_start_date: string
  completed: boolean
  late: boolean
  subtasks_completed?: string[]
}

export interface Rating {
  id: string
  rater_id: string
  ratee_id: string
  chore_id: string
  week_start_date: string
  rating: number
}

export interface AssignmentWithDetails extends Assignment {
  user: User
  chore: Chore
}
