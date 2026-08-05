import { useState } from 'react'
import { BoardColumns } from './BoardColumns'
import { BoardToolbar } from './BoardToolbar'
import { CreateTaskModal } from './CreateTaskModal'
import styles from './Board.module.css'

export function Board() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className={styles.board}>
      <BoardToolbar onAddClick={() => setIsCreateModalOpen(true)} />
      <BoardColumns />
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
