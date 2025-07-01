// types/tasks.ts
export interface TomatoTask {
  id: string
  title: string
  completed: boolean
  startTime: number
  endTime: number
  actual: number
  category: string // 新增分类字段
  sessions: {
    startTime: number
    duration: number
    status: 'completed' | 'interrupted'
  }[]
}

export type TaskFilter = 'all' | 'active' | 'completed'
