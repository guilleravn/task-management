import { useQuery } from '@apollo/client/react'
import { BoardColumn } from './BoardColumn'
import { BoardColumnSkeleton } from './BoardColumnSkeleton'
import { BoardError } from './BoardError'
import { BoardEmpty } from './BoardEmpty'
import { STATUS_VALUES, STATUS_LABELS } from '../enums'
import { GET_TASKS } from '../graphql/queries'
import styles from './BoardColumns.module.css'

export function BoardColumns() {
  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
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

  if (error) return <BoardError onRetry={() => refetch()} />

  const tasks = data?.tasks ?? []

  if (tasks.length === 0) return <BoardEmpty />

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
