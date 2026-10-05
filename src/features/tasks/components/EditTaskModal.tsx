import toast from 'react-hot-toast'
import { Modal } from '../../../components/ui/Modal'
import { TaskForm, type TaskFormInput } from './TaskForm'
import { useUpdateTask } from '../hooks/useTaskMutations'
import type { Task } from '../types'

interface EditTaskModalProps {
  task: Task
  onClose: () => void
}

export function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const [updateTask, { loading }] = useUpdateTask()

  async function handleSave(input: TaskFormInput) {
    try {
      await updateTask({ variables: { input: { id: task.id, ...input } } })
      toast.success('Task updated')
      onClose()
    } catch {
      toast.error('Could not update the task. Please try again.')
    }
  }

  return (
    <Modal onClose={onClose} ariaLabel="Edit task">
      <TaskForm
        initialValues={{
          name: task.name,
          status: task.status,
          pointEstimate: task.pointEstimate,
          tags: task.tags,
          assignee: task.assignee,
          dueDate: new Date(task.dueDate),
        }}
        showStatus
        submitLabel="Save"
        isSubmitting={loading}
        onSubmit={handleSave}
        onCancel={onClose}
      />
    </Modal>
  )
}
