import { startOfWeek, endOfWeek, addWeeks, format, isMonday, isTuesday } from 'date-fns'

export function getWeekStartDate(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 2 }) // Tuesday
}

export function getWeekEndDate(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 2 }) // Tuesday
}

export function getCurrentWeekStart(): string {
  return format(getWeekStartDate(), 'yyyy-MM-dd')
}

export function getCurrentWeekEnd(): string {
  return format(getWeekEndDate(), 'yyyy-MM-dd')
}

export function getNextWeekStart(): string {
  return format(addWeeks(getWeekStartDate(), 1), 'yyyy-MM-dd')
}

export function isRotationDay(): boolean {
  return isTuesday(new Date())
}

export function isQualityCheckDay(): boolean {
  return isMonday(new Date())
}

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function isLate(assignment: { completed: boolean; late: boolean }): boolean {
  return !assignment.completed && assignment.late
}
