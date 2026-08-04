import { BoardColumn } from './BoardColumn'
import styles from './BoardColumns.module.css'

const COLUMNS = ['Backlog', 'Todo', 'In Progress', 'Done', 'Cancelled']

export function BoardColumns() {
  return (
    <div className={styles.columns}>
      {COLUMNS.map((title) => (
        <BoardColumn key={title} title={title} />
      ))}
    </div>
  )
}
