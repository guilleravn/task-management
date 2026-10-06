import toast from 'react-hot-toast'
import { Modal } from '../../../components/ui/Modal'
import { TaskForm, type TaskFormInput, type TaskFormValues } from './TaskForm'
import { useCreateTask } from '../hooks/useTaskMutations'

const EMPTY_TASK: TaskFormValues = {
  name: '',
  status: 'BACKLOG',
  pointEstimate: null,
  tags: [],
  assignee: null,
  dueDate: null,
}

interface CreateTaskModalProps {
  onClose: () => void
}

// Mounted only while open (see Board), so the form starts empty every time it opens.
export function CreateTaskModal({ onClose }: CreateTaskModalProps) {
  const [createTask, { loading }] = useCreateTask()

  async function handleCreate(input: TaskFormInput) {
    try {
      await createTask({ variables: { input } })
      toast.success('Task created')
      onClose()
    } catch {
      toast.error('Could not create the task. Please try again.')
    }
  }

  return (
    <Modal onClose={onClose} ariaLabel="Create task">
      <TaskForm
        initialValues={EMPTY_TASK}
        submitLabel="Create"
        isSubmitting={loading}
        onSubmit={handleCreate}
        onCancel={onClose}
      />
    </Modal>
  )
}
