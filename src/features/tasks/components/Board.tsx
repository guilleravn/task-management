import { useState } from 'react'
import { BoardColumns } from './BoardColumns'
import { BoardToolbar } from './BoardToolbar'
import { CreateTaskModal } from './CreateTaskModal'
import styles from './Board.module.css'

interface BoardProps {
  onlyMine?: boolean
}

export function Board({ onlyMine = false }: BoardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className={styles.board}>
      <BoardToolbar onAddClick={() => setIsCreateModalOpen(true)} onlyMine={onlyMine} />
      <BoardColumns onlyMine={onlyMine} />
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
