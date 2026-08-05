import { useState } from 'react'
import { ListIcon } from '../../../components/icons/ListIcon'
import { GridIcon } from '../../../components/icons/GridIcon'
import { AddButtonIcon } from '../../../components/icons/AddButtonIcon'
import styles from './BoardToolbar.module.css'

type ViewMode = 'list' | 'grid'

interface BoardToolbarProps {
  onAddClick: () => void
}

export function BoardToolbar({ onAddClick }: BoardToolbarProps) {
  const [view, setView] = useState<ViewMode>('grid')

  return (
    <div className={styles.toolbar}>
      <div className={styles.viewToggle}>
        <button
          type="button"
          aria-label="List view"
          className={
            view === 'list' ? `${styles.viewButton} ${styles.active}` : styles.viewButton
          }
          onClick={() => setView('list')}
        >
          <ListIcon />
        </button>
        <button
          type="button"
          aria-label="Grid view"
          className={
            view === 'grid' ? `${styles.viewButton} ${styles.active}` : styles.viewButton
          }
          onClick={() => setView('grid')}
        >
          <GridIcon />
        </button>
      </div>
      <button type="button" className={styles.addButton} aria-label="Add task" onClick={onAddClick}>
        <AddButtonIcon />
      </button>
    </div>
  )
}
