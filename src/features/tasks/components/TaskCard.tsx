import { TASK_TAG_LABELS, TASK_TAG_COLOR_VARS, type TaskTag } from '../enums'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  name: string
  tags: TaskTag[]
}

export function TaskCard({ name, tags }: TaskCardProps) {
  return (
    <div className={styles.card}>
      <h4 className={styles.name}>{name}</h4>
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
    </div>
  )
}
