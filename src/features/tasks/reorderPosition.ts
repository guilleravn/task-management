import type { Task } from './types'

export function getReorderedPosition(tasksInColumn: Task[], dropIndex: number): number {
  const before = tasksInColumn[dropIndex - 1]
  const after = tasksInColumn[dropIndex]

  if (!before && !after) return 0
  if (!before) return after.position - 1
  if (!after) return before.position + 1
  return (before.position + after.position) / 2
}
