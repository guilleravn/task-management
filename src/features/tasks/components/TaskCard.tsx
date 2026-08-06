import { ClockIcon } from '../../../components/icons/ClockIcon'
import { Avatar } from '../../../components/ui/Avatar'
import { normalizeAvatarUrl } from '../../../lib/dicebear'
import { TaskActionsMenu } from './TaskActionsMenu'
import { getDueDateDisplay } from '../dueDateDisplay'
import { TASK_TAG_LABELS, TASK_TAG_COLOR_VARS, POINT_ESTIMATE_LABELS } from '../enums'
import type { Task } from '../types'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { name, status, tags, dueDate, pointEstimate, assignee } = task
  const dueDateDisplay = getDueDateDisplay(dueDate, status)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.name}>{name}</h4>
        <TaskActionsMenu task={task} />
      </div>
      <div className={styles.meta}>
        <span className={styles.points}>{POINT_ESTIMATE_LABELS[pointEstimate]} Points</span>
        <span className={styles.dueDate} style={{ color: dueDateDisplay.color }}>
          <ClockIcon />
          {dueDateDisplay.label}
        </span>
      </div>
      <div className={styles.tags}>
        {tags.map((tag) => {
          const colorVar = `var(${TASK_TAG_COLOR_VARS[tag]})`
          return (
            <span
              key={tag}
              className={styles.tag}
              style={{
                color: colorVar,
                backgroundColor: `color-mix(in srgb, ${colorVar} 10%, transparent)`,
              }}
            >
              {TASK_TAG_LABELS[tag]}
            </span>
          )
        })}
      </div>
      <div className={styles.footer}>
        <Avatar
          src={normalizeAvatarUrl(assignee?.avatar)}
          alt={assignee?.fullName ?? 'Unassigned'}
          size="small"
        />
      </div>
    </div>
  )
}
