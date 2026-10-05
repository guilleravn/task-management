import { useState } from 'react'
import toast from 'react-hot-toast'
import { OptionsIcon } from '../../../components/icons/OptionsIcon'
import { PencilIcon } from '../../../components/icons/PencilIcon'
import { TrashIcon } from '../../../components/icons/TrashIcon'
import { Popover } from '../../../components/ui/Popover'
import { EditTaskModal } from './EditTaskModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { useDeleteTask } from '../hooks/useTaskMutations'
import type { Task } from '../types'
import styles from './TaskActionsMenu.module.css'

interface TaskActionsMenuProps {
  task: Task
}

export function TaskActionsMenu({ task }: TaskActionsMenuProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [deleteTask, { loading: isDeleting }] = useDeleteTask()

  async function handleDelete() {
    try {
      await deleteTask({ variables: { input: { id: task.id } } })
      toast.success('Task deleted')
      setIsDeleteOpen(false)
    } catch {
      toast.error('Could not delete the task. Please try again.')
    }
  }

  return (
    <>
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

      {isEditOpen && <EditTaskModal task={task} onClose={() => setIsEditOpen(false)} />}

      {isDeleteOpen && (
        <DeleteConfirmModal
          taskName={task.name}
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </>
  )
}
