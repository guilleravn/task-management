import { ClockIcon } from '../../../components/icons/ClockIcon'
import { OptionsIcon } from '../../../components/icons/OptionsIcon'
import { Avatar } from '../../../components/ui/Avatar'
import {
  TASK_TAG_LABELS,
  TASK_TAG_COLOR_VARS,
  POINT_ESTIMATE_LABELS,
  type TaskTag,
  type PointEstimate,
} from '../enums'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  name: string
  tags: TaskTag[]
  dueDate: string
  estimatedPoints: PointEstimate
  assigneeName: string
  assigneeAvatarUrl: string
}

export function TaskCard({
  name,
  tags,
  dueDate,
  estimatedPoints,
  assigneeName,
  assigneeAvatarUrl,
}: TaskCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.name}>{name}</h4>
        <button type="button" className={styles.optionsButton} aria-label="Task options">
          <OptionsIcon />
        </button>
      </div>
       <div className={styles.meta}>
        <span className={styles.points}>{POINT_ESTIMATE_LABELS[estimatedPoints]} Points</span>
        <span className={styles.dueDate}>
          <ClockIcon />
          {dueDate}
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
        <Avatar src={assigneeAvatarUrl} alt={assigneeName} size="small" />
      </div>
    </div>
  )
}
