import styles from './BoardEmpty.module.css'

export function BoardEmpty() {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>No tasks found.</p>
    </div>
  )
}
