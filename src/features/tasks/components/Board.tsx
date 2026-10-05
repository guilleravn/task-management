import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { BoardColumns } from './BoardColumns'
import { BoardList } from './BoardList'
import { BoardColumnSkeleton } from './BoardColumnSkeleton'
import { BoardError } from './BoardError'
import { BoardEmpty } from './BoardEmpty'
import { BoardToolbar, type ViewMode } from './BoardToolbar'
import { CreateTaskModal } from './CreateTaskModal'
import { TaskCard } from './TaskCard'
import { getReorderedPosition } from '../reorderPosition'
import { STATUS_VALUES, STATUS_LABELS, type Status } from '../enums'
import { GET_TASKS } from '../graphql/queries'
import { useMoveTask } from '../hooks/useTaskMutations'
import { useTaskFilters } from '../hooks/useTaskFilters'
import { GET_PROFILE } from '../../profile/graphql/queries'
import type { Task } from '../types'
import styles from './Board.module.css'
import columnsStyles from './BoardColumns.module.css'

interface BoardProps {
  onlyMine?: boolean
}

export function Board({ onlyMine = false }: BoardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [view, setView] = useState<ViewMode>('grid')
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [searchParams] = useSearchParams()
  const name = searchParams.get('q') || undefined

  const {
    status: statusFilter,
    points: pointsFilter,
    tags: tagsFilter,
    dueDate: dueDateFilter,
    assigneeId: urlAssigneeId,
  } = useTaskFilters()

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
        status: statusFilter ?? undefined,
        pointEstimate: pointsFilter ?? undefined,
        tags: tagsFilter.length > 0 ? tagsFilter : undefined,
        dueDate: dueDateFilter?.toISOString(),
      },
    },
    skip: isWaitingForProfile,
  })

  const tasks = data?.tasks ?? []
  // With a status filter only that column/group is shown, so a drag can only reorder within it
  // and can never move a task out of the filtered list.
  const visibleStatuses = statusFilter ? [statusFilter] : STATUS_VALUES

  const moveTask = useMoveTask()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(tasks.find((task) => task.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const draggedTask = tasks.find((task) => task.id === active.id)
    if (!draggedTask) return

    const overStatus = STATUS_VALUES.includes(over.id as Status)
      ? (over.id as Status)
      : tasks.find((task) => task.id === over.id)?.status

    if (!overStatus) return

    const columnTasks = tasks
      .filter((task) => task.status === overStatus && task.id !== draggedTask.id)
      .sort((a, b) => a.position - b.position)

    const overIndex = columnTasks.findIndex((task) => task.id === over.id)
    const dropIndex = overIndex === -1 ? columnTasks.length : overIndex

    const newPosition = getReorderedPosition(columnTasks, dropIndex)

    if (draggedTask.status === overStatus && draggedTask.position === newPosition) return

    moveTask(draggedTask, overStatus, newPosition).catch(() => {
      toast.error('Could not move the task. Please try again.')
    })
  }

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

    if (tasks.length === 0) return <BoardEmpty />

    return view === 'list' ? (
      <BoardList tasks={tasks} statuses={visibleStatuses} />
    ) : (
      <BoardColumns tasks={tasks} statuses={visibleStatuses} />
    )
  }

  return (
    <div className={styles.board}>
      <BoardToolbar
        onAddClick={() => setIsCreateModalOpen(true)}
        onlyMine={onlyMine}
        view={view}
        onViewChange={setView}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {renderContent()}
        <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
      </DndContext>
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
