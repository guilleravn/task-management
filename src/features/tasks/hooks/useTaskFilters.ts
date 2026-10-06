import { useSearchParams } from 'react-router-dom'
import { useUrlParam } from '../../../hooks/useUrlParam'
import {
  POINT_ESTIMATE_VALUES,
  STATUS_VALUES,
  TASK_TAG_VALUES,
  isOneOf,
  type PointEstimate,
  type Status,
  type TaskTag,
} from '../enums'

// The URL is user input: every deserializer validates and drops values it doesn't recognize
// instead of casting them, so a hand-edited link can't reach the query or crash the board.

const FILTER_KEYS = ['status', 'points', 'tags', 'dueDate', 'assigneeId']

const statusParam = {
  serialize: (value: Status | null) => value ?? '',
  deserialize: (raw: string | null) => (isOneOf(STATUS_VALUES, raw) ? raw : null),
}

const pointsParam = {
  serialize: (value: PointEstimate | null) => value ?? '',
  deserialize: (raw: string | null) => (isOneOf(POINT_ESTIMATE_VALUES, raw) ? raw : null),
}

const tagsParam = {
  serialize: (value: TaskTag[]) => value.join(','),
  deserialize: (raw: string | null): TaskTag[] => {
    if (!raw) return []
    const validTags = raw.split(',').filter((tag) => isOneOf(TASK_TAG_VALUES, tag))
    return [...new Set(validTags)]
  },
}

const dueDateParam = {
  serialize: (value: Date | null) => value?.toISOString() ?? '',
  deserialize: (raw: string | null) => {
    if (!raw) return null
    const date = new Date(raw)
    return Number.isNaN(date.getTime()) ? null : date
  },
}

const assigneeIdParam = {
  serialize: (value: string | null) => value ?? '',
  deserialize: (raw: string | null) => raw || null,
}

export function useTaskFilters() {
  const [status, setStatus] = useUrlParam('status', statusParam)
  const [points, setPoints] = useUrlParam('points', pointsParam)
  const [tags, setTags] = useUrlParam('tags', tagsParam)
  const [dueDate, setDueDate] = useUrlParam('dueDate', dueDateParam)
  const [assigneeId, setAssigneeId] = useUrlParam('assigneeId', assigneeIdParam)
  const [, setSearchParams] = useSearchParams()

  // Clears every filter in one URL update. The search (`q`) is not a filter and is kept.
  function clear() {
    setSearchParams(
      (params) => {
        FILTER_KEYS.forEach((key) => params.delete(key))
        return params
      },
      { replace: true },
    )
  }

  return {
    status,
    setStatus,
    points,
    setPoints,
    tags,
    setTags,
    dueDate,
    setDueDate,
    assigneeId,
    setAssigneeId,
    clear,
  }
}
