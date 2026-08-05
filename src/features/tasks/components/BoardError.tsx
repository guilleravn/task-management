import styles from './BoardError.module.css'

interface BoardErrorProps {
  onRetry: () => void
}

export function BoardError({ onRetry }: BoardErrorProps) {
  return (
    <div className={styles.error}>
      <p className={styles.message}>Something went wrong while loading your tasks.</p>
      <button type="button" className={styles.retryButton} onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}
