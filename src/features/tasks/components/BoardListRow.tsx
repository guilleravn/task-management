import { Avatar } from '../../../components/ui/Avatar'
import { normalizeAvatarUrl } from '../../../lib/dicebear'
import { TaskActionsMenu } from './TaskActionsMenu'
import { getDueDateDisplay } from '../dueDateDisplay'
import { TASK_TAG_LABELS, TASK_TAG_COLOR_VARS, POINT_ESTIMATE_LABELS } from '../enums'
import type { Task } from '../types'
import styles from './BoardListRow.module.css'

interface BoardListRowProps {
  task: Task
  index: number
}

export function BoardListRow({ task, index }: BoardListRowProps) {
  const { name, status, tags, dueDate, pointEstimate, assignee } = task
  const dueDateDisplay = getDueDateDisplay(dueDate, status)
  const [firstTag, ...restTags] = tags

  return (
    <div className={styles.row} style={{ borderLeftColor: dueDateDisplay.color }}>
      <span className={styles.index}>{String(index).padStart(2, '0')}</span>
      <span className={styles.name}>{name}</span>
      <span className={styles.tags}>
        {firstTag && (
          <span
            className={styles.tag}
            style={{
              color: `var(${TASK_TAG_COLOR_VARS[firstTag]})`,
              backgroundColor: `color-mix(in srgb, var(${TASK_TAG_COLOR_VARS[firstTag]}) 10%, transparent)`,
            }}
          >
            {TASK_TAG_LABELS[firstTag]}
          </span>
        )}
        {restTags.length > 0 && <span className={styles.tagMore}>+{restTags.length}</span>}
      </span>
      <span className={styles.estimate}>{POINT_ESTIMATE_LABELS[pointEstimate]} Points</span>
      <span className={styles.assignee}>
        <Avatar
          src={normalizeAvatarUrl(assignee?.avatar)}
          alt={assignee?.fullName ?? 'Unassigned'}
          size="small"
        />
        {assignee?.fullName ?? 'Unassigned'}
      </span>
      <span className={styles.dueDate} style={{ color: dueDateDisplay.color }}>
        {dueDateDisplay.label}
      </span>
      <TaskActionsMenu task={task} />
    </div>
  )
}
