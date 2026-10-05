import { useQuery } from '@apollo/client/react'
import { ListIcon } from '../../../components/icons/ListIcon'
import { GridIcon } from '../../../components/icons/GridIcon'
import { AddButtonIcon } from '../../../components/icons/AddButtonIcon'
import { ResetIcon } from '../../../components/icons/ResetIcon'
import { EstimatePicker } from './EstimatePicker'
import { LabelPicker } from './LabelPicker'
import { DueDatePicker } from './DueDatePicker'
import { AssigneePicker } from './AssigneePicker'
import { GET_USERS } from '../graphql/queries'
import { useTaskFilters } from '../hooks/useTaskFilters'
import type { User } from '../types'
import styles from './BoardToolbar.module.css'

export type ViewMode = 'list' | 'grid'

interface BoardToolbarProps {
  onAddClick: () => void
  onlyMine?: boolean
  view: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function BoardToolbar({ onAddClick, onlyMine = false, view, onViewChange }: BoardToolbarProps) {
  const {
    points: pointsFilter,
    setPoints: setPointsFilter,
    tags: tagsFilter,
    setTags: setTagsFilter,
    dueDate: dueDateFilter,
    setDueDate: setDueDateFilter,
    assigneeId: assigneeIdFilter,
    setAssigneeId: setAssigneeIdFilter,
    clear: clearFilters,
  } = useTaskFilters()

  const { data: usersData } = useQuery(GET_USERS, { skip: onlyMine })
  const users = usersData?.users ?? []
  const assigneeFilterUser = users.find((user) => user.id === assigneeIdFilter) ?? null

  function handleAssigneeChange(user: User) {
    setAssigneeIdFilter(user.id)
  }

  const hasActiveFilters =
    pointsFilter !== null ||
    tagsFilter.length > 0 ||
    dueDateFilter !== null ||
    (!onlyMine && assigneeIdFilter !== null)

  return (
    <div className={styles.toolbar}>
      <div className={styles.start}>
        <div className={styles.viewToggle}>
          <button
            type="button"
            aria-label="List view"
            className={
              view === 'list' ? `${styles.viewButton} ${styles.active}` : styles.viewButton
            }
            onClick={() => onViewChange('list')}
          >
            <ListIcon />
          </button>
          <button
            type="button"
            aria-label="Grid view"
            className={
              view === 'grid' ? `${styles.viewButton} ${styles.active}` : styles.viewButton
            }
            onClick={() => onViewChange('grid')}
          >
            <GridIcon />
          </button>
        </div>

        <div className={styles.filters}>
          <EstimatePicker value={pointsFilter} onChange={setPointsFilter} />
          <LabelPicker value={tagsFilter} onChange={setTagsFilter} />
          <DueDatePicker value={dueDateFilter} onChange={setDueDateFilter} />
          {!onlyMine && (
            <AssigneePicker value={assigneeFilterUser} onChange={handleAssigneeChange} />
          )}
          {hasActiveFilters && (
            <button type="button" className={styles.clearButton} onClick={clearFilters}>
              <ResetIcon />
              Clear filters
            </button>
          )}
        </div>
      </div>

      <button type="button" className={styles.addButton} aria-label="Add task" onClick={onAddClick}>
        <AddButtonIcon />
      </button>
    </div>
  )
}
