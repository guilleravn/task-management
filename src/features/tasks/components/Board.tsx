import { BoardColumns } from './BoardColumns'
import { BoardToolbar } from './BoardToolbar'
import styles from './Board.module.css'

export function Board() {
  return (
    <div className={styles.board}>
      <BoardToolbar />
      <BoardColumns />
    </div>
  )
}
