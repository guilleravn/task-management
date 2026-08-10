import { BoardColumn } from './BoardColumn'
import { STATUS_VALUES, STATUS_LABELS } from '../enums'
import type { Task } from '../types'
import styles from './BoardColumns.module.css'

interface BoardColumnsProps {
  tasks: Task[]
}

export function BoardColumns({ tasks }: BoardColumnsProps) {
  return (
    <div className={styles.columns}>
      {STATUS_VALUES.map((status) => (
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
