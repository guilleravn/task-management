import { useQuery } from '@apollo/client/react'
import { BoardColumn } from './BoardColumn'
import { BoardColumnSkeleton } from './BoardColumnSkeleton'
import { STATUS_VALUES, STATUS_LABELS } from '../enums'
import { GET_TASKS } from '../graphql/queries'
import type { Task } from '../types'
import styles from './BoardColumns.module.css'

interface GetTasksResult {
  tasks: Task[]
}

export function BoardColumns() {
  const { data, loading, error } = useQuery<GetTasksResult>(GET_TASKS, {
    variables: { input: {} },
  })

  if (loading) {
    return (
      <div className={styles.columns}>
        {STATUS_VALUES.map((status) => (
          <BoardColumnSkeleton key={status} title={STATUS_LABELS[status]} />
        ))}
      </div>
    )
  }

  if (error) return <p>Something went wrong.</p>

  const tasks = data?.tasks ?? []

  return (
    <div className={styles.columns}>
      {STATUS_VALUES.map((status) => (
        <BoardColumn
          key={status}
          title={STATUS_LABELS[status]}
          tasks={tasks.filter((task) => task.status === status)}
        />
      ))}
    </div>
  )
}
