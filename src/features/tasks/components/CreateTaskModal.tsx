import { useState } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../../components/ui/Modal'
import { EstimatePicker } from './EstimatePicker'
import { LabelPicker } from './LabelPicker'
import { AssigneePicker } from './AssigneePicker'
import { DueDatePicker } from './DueDatePicker'
import { useCreateTask } from '../hooks/useTaskMutations'
import type { PointEstimate, TaskTag } from '../enums'
import type { User } from '../types'
import styles from './CreateTaskModal.module.css'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [name, setName] = useState('')
  const [pointEstimate, setPointEstimate] = useState<PointEstimate | null>(null)
  const [tags, setTags] = useState<TaskTag[]>([])
  const [assignee, setAssignee] = useState<User | null>(null)
  const [dueDate, setDueDate] = useState<Date | null>(null)

  const [createTask, { loading }] = useCreateTask()

  function resetForm() {
    setName('')
    setPointEstimate(null)
    setTags([])
    setAssignee(null)
    setDueDate(null)
  }

  function handleCancel() {
    resetForm()
    onClose()
  }

  async function handleCreate() {
    try {
      await createTask({
        variables: {
          input: {
            name: name.trim(),
            status: 'BACKLOG',
            pointEstimate: pointEstimate ?? 'ZERO',
            dueDate: (dueDate ?? new Date()).toISOString(),
            tags,
            assigneeId: assignee?.id,
          },
        },
      })
      toast.success('Task created')
      resetForm()
      onClose()
    } catch {
      toast.error('Could not create the task. Please try again.')
    }
  }

  const isCreateDisabled = name.trim() === '' || loading

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Task Title"
        className={styles.titleInput}
      />

      <div className={styles.pills}>
        <EstimatePicker value={pointEstimate} onChange={setPointEstimate} />
        <AssigneePicker value={assignee} onChange={setAssignee} />
        <LabelPicker value={tags} onChange={setTags} />
        <DueDatePicker value={dueDate} onChange={setDueDate} />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={handleCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.createButton}
          disabled={isCreateDisabled}
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </Modal>
  )
}
