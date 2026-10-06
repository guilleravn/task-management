import { BoardColumn } from './BoardColumn'
import { STATUS_LABELS, type Status } from '../enums'
import type { Task } from '../types'
import styles from './BoardColumns.module.css'

interface BoardColumnsProps {
  tasks: Task[]
  statuses: readonly Status[]
}

export function BoardColumns({ tasks, statuses }: BoardColumnsProps) {
  return (
    <div className={styles.columns}>
      {statuses.map((status) => (
        <BoardColumn
          key={status}
          status={status}
          title={STATUS_LABELS[status]}
          tasks={tasks
            .filter((task) => task.status === status)
            .sort((a, b) => a.position - b.position)}
        />
      ))}
    </div>
  )
}
