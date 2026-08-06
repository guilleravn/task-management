import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { ListIcon } from '../../../components/icons/ListIcon'
import { GridIcon } from '../../../components/icons/GridIcon'
import { AddButtonIcon } from '../../../components/icons/AddButtonIcon'
import { ResetIcon } from '../../../components/icons/ResetIcon'
import { useUrlParam } from '../../../hooks/useUrlParam'
import { EstimatePicker } from './EstimatePicker'
import { LabelPicker } from './LabelPicker'
import { DueDatePicker } from './DueDatePicker'
import { AssigneePicker } from './AssigneePicker'
import { GET_USERS } from '../graphql/queries'
import type { PointEstimate, TaskTag } from '../enums'
import type { User } from '../types'
import styles from './BoardToolbar.module.css'

type ViewMode = 'list' | 'grid'

interface BoardToolbarProps {
  onAddClick: () => void
  onlyMine?: boolean
}

export function BoardToolbar({ onAddClick, onlyMine = false }: BoardToolbarProps) {
  const [view, setView] = useState<ViewMode>('grid')

  const [pointsFilter, setPointsFilter] = useUrlParam<PointEstimate | null>('points', {
    serialize: (value) => value ?? '',
    deserialize: (raw) => (raw as PointEstimate | null) ?? null,
  })

  const [tagsFilter, setTagsFilter] = useUrlParam<TaskTag[]>('tags', {
    serialize: (value) => value.join(','),
    deserialize: (raw) => (raw ? (raw.split(',') as TaskTag[]) : []),
  })

  const [dueDateFilter, setDueDateFilter] = useUrlParam<Date | null>('dueDate', {
    serialize: (value) => value?.toISOString() ?? '',
    deserialize: (raw) => (raw ? new Date(raw) : null),
  })

  const [assigneeIdFilter, setAssigneeIdFilter] = useUrlParam<string | null>('assigneeId', {
    serialize: (value) => value ?? '',
    deserialize: (raw) => raw || null,
  })

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

  const [, setSearchParams] = useSearchParams()

  function handleClearFilters() {
    setSearchParams(
      (params) => {
        params.delete('points')
        params.delete('tags')
        params.delete('dueDate')
        params.delete('assigneeId')
        return params
      },
      { replace: true },
    )
  }

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

        <div className={styles.filters}>
          <EstimatePicker value={pointsFilter} onChange={setPointsFilter} />
          <LabelPicker value={tagsFilter} onChange={setTagsFilter} />
          <DueDatePicker value={dueDateFilter} onChange={setDueDateFilter} />
          {!onlyMine && (
            <AssigneePicker value={assigneeFilterUser} onChange={handleAssigneeChange} />
          )}
          {hasActiveFilters && (
            <button type="button" className={styles.clearButton} onClick={handleClearFilters}>
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
