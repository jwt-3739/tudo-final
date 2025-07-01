// src\tools\CreateTask.ts
// 这是创建任务的工具

import { useTaskStore } from '@/stores/tasks'

export const useTaskCreator = () => {
  const taskStore = useTaskStore()

  // 公共创建任务方法
  const createTask = (params: {
    title: string
    duration?: number
    startTime?: number
    endTime?: number
    category?: string
  }) => {
    const now = Date.now()
    const defaultDuration = 25 * 60 * 1000 // 默认25分钟

    const taskData = {
      title: params.title,
      startTime: params.startTime || now,
      endTime: params.endTime || now + (params.duration || defaultDuration),
      category: params.category || '快速任务',
    }

    return taskStore.addTask(taskData)
  }

  return { createTask }
}
