import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTaskCard } from './SortableTaskCard'
import type { Status } from '../enums'
import type { Task } from '../types'
import styles from './BoardColumn.module.css'

interface BoardColumnProps {
  status: Status
  title: string
  tasks: Task[]
}

export function BoardColumn({ status, title, tasks }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const taskIds = tasks.map((task) => task.id)

  return (
    <div className={styles.column}>
      <h3 className={styles.title}>
        {title} ({tasks.length})
      </h3>
      <div
        ref={setNodeRef}
        className={isOver ? `${styles.cards} ${styles.isOver}` : styles.cards}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
