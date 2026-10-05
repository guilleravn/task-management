import { Modal } from '../../../components/ui/Modal'
import styles from './DeleteConfirmModal.module.css'

interface DeleteConfirmModalProps {
  taskName: string
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  taskName,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen onClose={onCancel} ariaLabel="Delete task">
      <p className={styles.message}>
        Are you sure you want to delete <strong>{taskName}</strong>? This action cannot be undone.
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}
