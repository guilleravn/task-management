import { TaskCard } from './TaskCard'
import styles from './BoardColumn.module.css'

interface BoardColumnProps {
  title: string
}

export function BoardColumn({ title }: BoardColumnProps) {
  return (
    <div className={styles.column}>
      <h3 className={styles.title}>{title}</h3>
      <TaskCard name="Example task" />
    </div>
  )
}
