import { TaskCardSkeleton } from './TaskCardSkeleton'
import styles from './BoardColumn.module.css'

interface BoardColumnSkeletonProps {
  title: string
}

export function BoardColumnSkeleton({ title }: BoardColumnSkeletonProps) {
  return (
    <div className={styles.column}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.cards}>
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  )
}
