import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useSearchParams } from 'react-router-dom'
import { BoardColumns } from './BoardColumns'
import { BoardList } from './BoardList'
import { BoardColumnSkeleton } from './BoardColumnSkeleton'
import { BoardError } from './BoardError'
import { BoardEmpty } from './BoardEmpty'
import { BoardToolbar, type ViewMode } from './BoardToolbar'
import { CreateTaskModal } from './CreateTaskModal'
import { useUrlParam } from '../../../hooks/useUrlParam'
import { STATUS_VALUES, STATUS_LABELS, type PointEstimate, type TaskTag } from '../enums'
import { GET_TASKS } from '../graphql/queries'
import { GET_PROFILE } from '../../profile/graphql/queries'
import styles from './Board.module.css'
import columnsStyles from './BoardColumns.module.css'

interface BoardProps {
  onlyMine?: boolean
}

export function Board({ onlyMine = false }: BoardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [view, setView] = useState<ViewMode>('grid')
  const [searchParams] = useSearchParams()
  const name = searchParams.get('q') || undefined

  const [pointsFilter] = useUrlParam<PointEstimate | null>('points', {
    serialize: (value) => value ?? '',
    deserialize: (raw) => (raw as PointEstimate | null) ?? null,
  })

  const [tagsFilter] = useUrlParam<TaskTag[]>('tags', {
    serialize: (value) => value.join(','),
    deserialize: (raw) => (raw ? (raw.split(',') as TaskTag[]) : []),
  })

  const [dueDateFilter] = useUrlParam<Date | null>('dueDate', {
    serialize: (value) => value?.toISOString() ?? '',
    deserialize: (raw) => (raw ? new Date(raw) : null),
  })

  const [urlAssigneeId] = useUrlParam<string | null>('assigneeId', {
    serialize: (value) => value ?? '',
    deserialize: (raw) => raw || null,
  })

  const { data: profileData, loading: profileLoading } = useQuery(GET_PROFILE, {
    skip: !onlyMine,
  })
  const assigneeId = onlyMine ? profileData?.profile.id : urlAssigneeId ?? undefined
  const isWaitingForProfile = onlyMine && (profileLoading || !assigneeId)

  const { data, loading, error, refetch } = useQuery(GET_TASKS, {
    variables: {
      input: {
        name,
        assigneeId,
        pointEstimate: pointsFilter ?? undefined,
        tags: tagsFilter.length > 0 ? tagsFilter : undefined,
        dueDate: dueDateFilter?.toISOString(),
      },
    },
    skip: isWaitingForProfile,
  })

  function renderContent() {
    if (loading || isWaitingForProfile) {
      return (
        <div className={columnsStyles.columns}>
          {STATUS_VALUES.map((status) => (
            <BoardColumnSkeleton key={status} title={STATUS_LABELS[status]} />
          ))}
        </div>
      )
    }

    if (error) return <BoardError onRetry={() => refetch()} />

    const tasks = data?.tasks ?? []

    if (tasks.length === 0) return <BoardEmpty />

    return view === 'list' ? <BoardList tasks={tasks} /> : <BoardColumns tasks={tasks} />
  }

  return (
    <div className={styles.board}>
      <BoardToolbar
        onAddClick={() => setIsCreateModalOpen(true)}
        onlyMine={onlyMine}
        view={view}
        onViewChange={setView}
      />
      {renderContent()}
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
