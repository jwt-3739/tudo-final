<!-- src\views\layout\modules\WorkMod.vue -->
<template>
  <div class="work-container">
    <!-- 内容主体 -->
    <div class="content-wrapper">
      <!-- 快速开始组件 -->
      <QuickStart @started="handleTaskStarted" />

      <!-- 输入框和添加任务按钮 -->
      <el-input
        v-model="newTask"
        placeholder="输入新任务"
        class="task-input"
        clearable
        @keyup.enter="handleOpenForm"
      >
        <template #append>
          <el-button type="primary" @click="handleOpenForm">添加任务</el-button>
        </template>
      </el-input>

      <!-- 任务表单弹窗 -->
      <TaskFormDialog
        ref="formDialog"
        :initial-title="newTask"
        :categories="categories"
        @submit="handleAddTask"
      />

      <!-- 任务列表 -->
      <div class="task-list">
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @delete="handleDeleteTask"
          @toggle="handleToggleTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { ElMessage } from 'element-plus'

import { useTaskStore } from '@/stores/tasks'
import TaskFormDialog from '@/components/TaskFormDialog.vue'
import TaskItem from '@/components/TaskItem.vue'
import QuickStart from '@/components/QuickStart.vue'

// 获取分类列表
const taskStore = useTaskStore()
const categories = computed(() => taskStore.categories)

// 原有任务相关逻辑保持不变...
const tasks = computed(() => taskStore.tasks)
const formDialog = ref()
const newTask = ref('')

const handleOpenForm = () => {
  if (!newTask.value.trim()) {
    ElMessage.warning('请输入任务名称')
    return
  }
  formDialog.value.open()
}

const handleAddTask = (data: {
  title: string
  startTime: number
  endTime: number
  category: string
}) => {
  taskStore.addTask({
    title: data.title,
    startTime: data.startTime,
    endTime: data.endTime,
    category: data.category,
  })
  newTask.value = ''
}

const handleDeleteTask = (id: string) => {
  taskStore.deleteTask(id)
}

const handleToggleTask = (id: string) => {
  const task = tasks.value.find((task) => task.id === id)
  if (task) {
    taskStore.updateTask(id, {
      completed: !task.completed,
    })
  }
}

const handleTaskStarted = (duration: number) => {
  ElMessage.success(`已开始 ${duration / 60} 分钟的任务`)
}
</script>

<style scoped>
.work-container {
  position: relative;
  height: 100%;
  padding-top: 60px; /* 为用户信息栏预留高度 */
}

.content-wrapper {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

/* 原有样式保持不变... */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.task-input {
  margin-top: 20px;
  max-width: 600px;
}
</style>
