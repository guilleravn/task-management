import { useState } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../../components/ui/Modal'
import { EstimatePicker } from './EstimatePicker'
import { LabelPicker } from './LabelPicker'
import { AssigneePicker } from './AssigneePicker'
import { DueDatePicker } from './DueDatePicker'
import { StatusPicker } from './StatusPicker'
import { useUpdateTask } from '../hooks/useTaskMutations'
import type { Status, TaskTag, PointEstimate } from '../enums'
import type { TaskAssignee } from '../types'
import styles from './EditTaskModal.module.css'

interface EditTaskModalTask {
  id: string
  name: string
  status: Status
  tags: TaskTag[]
  dueDate: string
  pointEstimate: PointEstimate
  assignee: TaskAssignee | null
}

interface EditTaskModalProps {
  task: EditTaskModalTask
  onClose: () => void
}

export function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const [name, setName] = useState(task.name)
  const [status, setStatus] = useState<Status>(task.status)
  const [pointEstimate, setPointEstimate] = useState<PointEstimate | null>(task.pointEstimate)
  const [tags, setTags] = useState<TaskTag[]>(task.tags)
  const [assignee, setAssignee] = useState<TaskAssignee | null>(task.assignee)
  const [dueDate, setDueDate] = useState<Date | null>(new Date(task.dueDate))

  const [updateTask, { loading }] = useUpdateTask()

  async function handleSave() {
    try {
      await updateTask({
        variables: {
          input: {
            id: task.id,
            name: name.trim(),
            status,
            pointEstimate: pointEstimate ?? 'ZERO',
            dueDate: (dueDate ?? new Date()).toISOString(),
            tags,
            assigneeId: assignee?.id,
          },
        },
      })
      toast.success('Task updated')
      onClose()
    } catch {
      toast.error('Could not update the task. Please try again.')
    }
  }

  const isSaveDisabled = name.trim() === '' || loading

  return (
    <Modal isOpen onClose={onClose} ariaLabel="Edit task">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Task Title"
        className={styles.titleInput}
      />

      <div className={styles.pills}>
        <StatusPicker value={status} onChange={setStatus} />
        <EstimatePicker value={pointEstimate} onChange={setPointEstimate} />
        <AssigneePicker value={assignee} onChange={setAssignee} />
        <LabelPicker value={tags} onChange={setTags} />
        <DueDatePicker value={dueDate} onChange={setDueDate} />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.saveButton}
          disabled={isSaveDisabled}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Modal>
  )
}
