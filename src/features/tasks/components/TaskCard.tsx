import { ClockIcon } from '../../../components/icons/ClockIcon'
import { OptionsIcon } from '../../../components/icons/OptionsIcon'
import { Avatar } from '../../../components/ui/Avatar'
import { normalizeAvatarUrl } from '../../../lib/dicebear'
import {TASK_TAG_LABELS,TASK_TAG_COLOR_VARS,POINT_ESTIMATE_LABELS, type TaskTag, type PointEstimate,} from '../enums'
import type { TaskAssignee } from '../types'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  name: string
  tags: TaskTag[]
  dueDate: string
  pointEstimate: PointEstimate
  assignee: TaskAssignee | null
}

export function TaskCard({ name, tags, dueDate, pointEstimate, assignee }: TaskCardProps) {
  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.name}>{name}</h4>
        <button type="button" className={styles.optionsButton} aria-label="Task options">
          <OptionsIcon />
        </button>
      </div>
      <div className={styles.meta}>
        <span className={styles.points}>{POINT_ESTIMATE_LABELS[pointEstimate]} Points</span>
        <span className={styles.dueDate}>
          <ClockIcon />
          {formattedDueDate}
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
