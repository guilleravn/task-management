import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import toast from 'react-hot-toast'
import { ClockIcon } from '../../../components/icons/ClockIcon'
import { OptionsIcon } from '../../../components/icons/OptionsIcon'
import { PencilIcon } from '../../../components/icons/PencilIcon'
import { TrashIcon } from '../../../components/icons/TrashIcon'
import { Popover } from '../../../components/ui/Popover'
import { Avatar } from '../../../components/ui/Avatar'
import { normalizeAvatarUrl } from '../../../lib/dicebear'
import { EditTaskModal } from './EditTaskModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { DELETE_TASK } from '../graphql/mutations'
import { GET_TASKS } from '../graphql/queries'
import {
  TASK_TAG_LABELS,
  TASK_TAG_COLOR_VARS,
  POINT_ESTIMATE_LABELS,
  type Status,
  type TaskTag,
  type PointEstimate,
} from '../enums'
import type { TaskAssignee } from '../types'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  id: string
  name: string
  status: Status
  tags: TaskTag[]
  dueDate: string
  pointEstimate: PointEstimate
  assignee: TaskAssignee | null
}

export function TaskCard({
  id,
  name,
  status,
  tags,
  dueDate,
  pointEstimate,
  assignee,
}: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [deleteTask, { loading: isDeleting }] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS, variables: { input: {} } }],
  })

  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  async function handleDelete() {
    try {
      await deleteTask({ variables: { input: { id } } })
      toast.success('Task deleted')
      setIsDeleteOpen(false)
    } catch {
      toast.error('Could not delete the task. Please try again.')
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.name}>{name}</h4>
        <Popover
          trigger={
            <span className={styles.optionsButton} aria-label="Task options">
              <OptionsIcon />
            </span>
          }
        >
          {(close) => (
            <ul className={styles.menu}>
              <li>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    setIsEditOpen(true)
                    close()
                  }}
                >
                  <PencilIcon />
                  Edit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    setIsDeleteOpen(true)
                    close()
                  }}
                >
                  <TrashIcon />
                  Delete
                </button>
              </li>
            </ul>
          )}
        </Popover>
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

      {isEditOpen && (
        <EditTaskModal
          task={{ id, name, status, tags, dueDate, pointEstimate, assignee }}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmModal
          taskName={name}
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  )
}
