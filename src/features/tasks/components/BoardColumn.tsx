import { TaskCard } from './TaskCard'
import type { Task } from '../types'
import styles from './BoardColumn.module.css'

interface BoardColumnProps {
  title: string
  tasks: Task[]
}

export function BoardColumn({ title, tasks }: BoardColumnProps) {
  return (
    <div className={styles.column}>
      <h3 className={styles.title}>
        {title} ({tasks.length})
      </h3>
      <div className={styles.cards}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
