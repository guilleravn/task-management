import { BoardListGroup } from './BoardListGroup'
import { STATUS_LABELS, type Status } from '../enums'
import type { Task } from '../types'
import styles from './BoardList.module.css'

interface BoardListProps {
  tasks: Task[]
  statuses: readonly Status[]
}

export function BoardList({ tasks, statuses }: BoardListProps) {
  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <span className={styles.headerIndex}>#</span>
        <span>Task Name</span>
        <span>Task Tags</span>
        <span>Estimate</span>
        <span>Task Assign Name</span>
        <span>Due Date</span>
        <span aria-hidden="true" />
      </div>

      {statuses.map((status) => (
        <BoardListGroup
          key={status}
          title={STATUS_LABELS[status]}
          tasks={tasks.filter((task) => task.status === status)}
        />
      ))}
    </div>
  )
}
