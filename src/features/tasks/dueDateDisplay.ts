import type { Status } from './enums'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getDueDateDisplay(dueDate: string, status: Status): { label: string; color: string } {
  const due = new Date(dueDate)
  const label = formatDate(due)

  if (status === 'DONE' || status === 'CANCELLED') {
    return { label, color: 'var(--color-on-time)' }
  }

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const startOfDue = new Date(due)
  startOfDue.setHours(0, 0, 0, 0)

  const daysUntilDue = Math.round((startOfDue.getTime() - startOfToday.getTime()) / 86400000)

  if (daysUntilDue < 0) return { label, color: 'var(--color-overdue)' }
  if (daysUntilDue < 2) return { label, color: 'var(--color-due-soon)' }
  return { label, color: 'var(--color-on-time)' }
}
