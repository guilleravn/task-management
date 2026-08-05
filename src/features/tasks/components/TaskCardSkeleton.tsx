import styles from './TaskCardSkeleton.module.css'

export function TaskCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.line} style={{ width: '70%' }} />
      <div className={styles.row}>
        <div className={styles.chip} />
        <div className={styles.chip} />
      </div>
      <div className={styles.row}>
        <div className={styles.line} style={{ width: '40%' }} />
        <div className={styles.line} style={{ width: '30%' }} />
      </div>
      <div className={styles.avatar} />
    </div>
  )
}
