import { BoardColumn } from './BoardColumn'
import { STATUS_VALUES, STATUS_LABELS } from '../enums'
import styles from './BoardColumns.module.css'

export function BoardColumns() {
  return (
    <div className={styles.columns}>
      {STATUS_VALUES.map((status) => (
        <BoardColumn key={status} title={STATUS_LABELS[status]} />
      ))}
    </div>
  )
}
