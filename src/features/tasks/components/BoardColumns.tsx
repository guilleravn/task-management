import { useQuery } from '@apollo/client/react'
import { useSearchParams } from 'react-router-dom'
import { BoardColumn } from './BoardColumn'
import { BoardColumnSkeleton } from './BoardColumnSkeleton'
import { BoardError } from './BoardError'
import { BoardEmpty } from './BoardEmpty'
import { useUrlParam } from '../../../hooks/useUrlParam'
import { STATUS_VALUES, STATUS_LABELS, type PointEstimate, type TaskTag } from '../enums'
import { GET_TASKS } from '../graphql/queries'
import { GET_PROFILE } from '../../profile/graphql/queries'
import styles from './BoardColumns.module.css'

interface BoardColumnsProps {
  onlyMine?: boolean
}

export function BoardColumns({ onlyMine = false }: BoardColumnsProps) {
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

  if (loading || isWaitingForProfile) {
    return (
      <div className={styles.columns}>
        {STATUS_VALUES.map((status) => (
          <BoardColumnSkeleton key={status} title={STATUS_LABELS[status]} />
        ))}
      </div>
    )
  }

  if (error) return <BoardError onRetry={() => refetch()} />

  const tasks = data?.tasks ?? []

  if (tasks.length === 0) return <BoardEmpty />

  return (
    <div className={styles.columns}>
      {STATUS_VALUES.map((status) => (
        <BoardColumn
          key={status}
          title={STATUS_LABELS[status]}
          tasks={tasks.filter((task) => task.status === status)}
        />
      ))}
    </div>
  )
}
