import { useMutation } from '@apollo/client/react'
import { CREATE_TASK, DELETE_TASK, UPDATE_TASK } from '../graphql/mutations'
import { GET_TASKS } from '../graphql/queries'
import type { Status } from '../enums'
import type { Task } from '../types'

// Passing the document (not { query, variables }) refetches every active GetTasks query,
// whatever filters it was run with. A create or edit can change which filtered lists a task
// belongs to, and only the server knows how its filters match.
const REFETCH_ACTIVE_TASK_LISTS = [GET_TASKS]

export function useCreateTask() {
  return useMutation(CREATE_TASK, { refetchQueries: REFETCH_ACTIVE_TASK_LISTS })
}

export function useUpdateTask() {
  return useMutation(UPDATE_TASK, { refetchQueries: REFETCH_ACTIVE_TASK_LISTS })
}

export function useDeleteTask() {
  return useMutation(DELETE_TASK, {
    refetchQueries: REFETCH_ACTIVE_TASK_LISTS,
    // Evicting removes the task from every cached list right away; the refetch then confirms.
    update(cache, { data }) {
      if (!data) return
      cache.evict({ id: cache.identify({ __typename: 'Task', id: data.deleteTask.id }) })
      cache.gc()
    },
  })
}

// Drag and drop: one optimistic update, no refetch. The normalized cache moves the card
// instantly and Apollo rolls it back on its own if the server rejects the change.
export function useMoveTask() {
  const [updateTask] = useMutation(UPDATE_TASK)

  function moveTask(task: Task, status: Status, position: number) {
    return updateTask({
      variables: { input: { id: task.id, status, position } },
      optimisticResponse: { updateTask: { ...task, status, position } },
    })
  }

  return moveTask
}
