import type { Status, TaskTag, PointEstimate } from './enums'

export interface MockTask {
  id: string
  name: string
  status: Status
  tags: TaskTag[]
  dueDate: string
  estimatedPoints: PointEstimate
  assigneeName: string
  assigneeAvatarUrl: string
}

export const MOCK_TASKS: MockTask[] = [
  {
    id: '1',
    name: 'Design onboarding flow',
    status: 'BACKLOG',
    tags: ['REACT'],
    dueDate: 'Today',
    estimatedPoints: 'FOUR',
    assigneeName: 'Jane Doe',
    assigneeAvatarUrl: 'https://i.pravatar.cc/80?u=1',
  },
  {
    id: '2',
    name: 'Fix login bug',
    status: 'BACKLOG',
    tags: ['NODE_JS'],
    dueDate: 'Tomorrow',
    estimatedPoints: 'TWO',
    assigneeName: 'John Smith',
    assigneeAvatarUrl: 'https://i.pravatar.cc/80?u=2',
  },
  {
    id: '3',
    name: 'Set up CI pipeline',
    status: 'TODO',
    tags: ['RAILS'],
    dueDate: 'Jul 6, 2026',
    estimatedPoints: 'ONE',
    assigneeName: 'Ana Lee',
    assigneeAvatarUrl: 'https://i.pravatar.cc/80?u=3',
  },
  {
    id: '4',
    name: 'Implement push notifications',
    status: 'IN_PROGRESS',
    tags: ['ANDROID', 'IOS'],
    dueDate: 'Yesterday',
    estimatedPoints: 'EIGHT',
    assigneeName: 'Mike Chen',
    assigneeAvatarUrl: 'https://i.pravatar.cc/80?u=4',
  },
  {
    id: '5',
    name: 'Update dependencies',
    status: 'DONE',
    tags: ['NODE_JS'],
    dueDate: 'Jun 30, 2026',
    estimatedPoints: 'ONE',
    assigneeName: 'Sara Kim',
    assigneeAvatarUrl: 'https://i.pravatar.cc/80?u=5',
  },
  {
    id: '6',
    name: 'Archive old sprint board',
    status: 'CANCELLED',
    tags: ['REACT'],
    dueDate: 'Jun 20, 2026',
    estimatedPoints: 'ZERO',
    assigneeName: 'Tom Reed',
    assigneeAvatarUrl: 'https://i.pravatar.cc/80?u=6',
  },
]
