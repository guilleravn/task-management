import styles from './TaskCard.module.css'

interface TaskCardProps {
  name: string
}

export function TaskCard({ name }: TaskCardProps) {
  return (
    <div className={styles.card}>
      <h4 className={styles.name}>{name}</h4>
    </div>
  )
}
