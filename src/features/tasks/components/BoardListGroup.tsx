import { useState } from 'react'
import { ChevronDownIcon } from '../../../components/icons/ChevronDownIcon'
import { BoardListRow } from './BoardListRow'
import type { Task } from '../types'
import styles from './BoardListGroup.module.css'

interface BoardListGroupProps {
  title: string
  tasks: Task[]
}

export function BoardListGroup({ title, tasks }: BoardListGroupProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.groupHeader}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={isOpen ? styles.chevron : `${styles.chevron} ${styles.chevronClosed}`}>
          <ChevronDownIcon />
        </span>
        <span className={styles.groupTitle}>
          {title} ({String(tasks.length).padStart(2, '0')})
        </span>
      </button>

      {isOpen && (
        <div className={styles.rows}>
          {tasks.map((task, index) => (
            <BoardListRow key={task.id} task={task} index={index + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
