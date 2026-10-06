import { useState } from 'react'
import { EstimatePicker } from './EstimatePicker'
import { LabelPicker } from './LabelPicker'
import { AssigneePicker } from './AssigneePicker'
import { DueDatePicker } from './DueDatePicker'
import { StatusPicker } from './StatusPicker'
import type { PointEstimate, Status, TaskTag } from '../enums'
import type { User } from '../types'
import styles from './TaskForm.module.css'

export interface TaskFormValues {
  name: string
  status: Status
  pointEstimate: PointEstimate | null
  tags: TaskTag[]
  assignee: User | null
  dueDate: Date | null
}

// The shape both CreateTaskInput and UpdateTaskInput (minus `id`) accept.
export interface TaskFormInput {
  name: string
  status: Status
  pointEstimate: PointEstimate
  tags: TaskTag[]
  dueDate: string
  assigneeId?: string
}

interface TaskFormProps {
  initialValues: TaskFormValues
  showStatus?: boolean
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (input: TaskFormInput) => void
  onCancel: () => void
}

function toTaskInput(values: TaskFormValues): TaskFormInput {
  return {
    name: values.name.trim(),
    status: values.status,
    pointEstimate: values.pointEstimate ?? 'ZERO',
    tags: values.tags,
    dueDate: (values.dueDate ?? new Date()).toISOString(),
    assigneeId: values.assignee?.id,
  }
}

export function TaskForm({
  initialValues,
  showStatus = false,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [name, setName] = useState(initialValues.name)
  const [status, setStatus] = useState(initialValues.status)
  const [pointEstimate, setPointEstimate] = useState(initialValues.pointEstimate)
  const [tags, setTags] = useState(initialValues.tags)
  const [assignee, setAssignee] = useState(initialValues.assignee)
  const [dueDate, setDueDate] = useState(initialValues.dueDate)

  function handleSubmit() {
    onSubmit(toTaskInput({ name, status, pointEstimate, tags, assignee, dueDate }))
  }

  const isSubmitDisabled = name.trim() === '' || isSubmitting

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Task Title"
        className={styles.titleInput}
      />

      <div className={styles.pills}>
        {showStatus && <StatusPicker value={status} onChange={setStatus} />}
        <EstimatePicker value={pointEstimate} onChange={setPointEstimate} />
        <AssigneePicker value={assignee} onChange={setAssignee} />
        <LabelPicker value={tags} onChange={setTags} />
        <DueDatePicker value={dueDate} onChange={setDueDate} />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.submitButton}
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          {submitLabel}
        </button>
      </div>
    </>
  )
}
