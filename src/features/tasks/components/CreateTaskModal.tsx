import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { EstimatePicker } from './EstimatePicker'
import { LabelPicker } from './LabelPicker'
import { AssigneePicker } from './AssigneePicker'
import { DueDatePicker } from './DueDatePicker'
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="button" className={styles.createButton} disabled={name.trim() === ''}>
          Create
        </button>
      </div>
    </Modal>
  )
}
