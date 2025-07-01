// stores/tasks.ts
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { TomatoTask } from '@/types/tasks'

export const useTaskStore = defineStore('task', () => {
  const tasks = useStorage<TomatoTask[]>('pomodoro-tasks', [])
  const categories = useStorage<string[]>('pomodoro-categories', ['工作', '学习', '健身']) // 默认分类

  const addTask = (data: {
    title: string
    startTime: number
    endTime: number
    category: string
  }) => {
    // 添加新分类的逻辑
    if (!categories.value.includes(data.category)) {
      categories.value.push(data.category)
    }

    tasks.value.push({
      id: crypto.randomUUID(),
      title: data.title,
      completed: false,
      startTime: data.startTime,
      endTime: data.endTime,
      actual: 0,
      category: data.category, // 新增分类
      sessions: [],
    })
  }

  const deleteTask = (id: string) => {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  const updateTask = (id: string, payload: Partial<TomatoTask>) => {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      Object.assign(task, payload)
      // 添加自动记录实际完成时间
      if (payload.completed === true) {
        task.actual = Date.now()
      }
    }
  }

  return {
    tasks,
    categories, // 导出分类列表
    addTask,
    deleteTask,
    updateTask,
  }
})
