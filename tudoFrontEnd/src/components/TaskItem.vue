<template>
  <el-card shadow="hover" class="task-card" :class="{ expanded: isExpanded }" @click="toggleExpand">
    <div class="task-content">
      <!-- 主内容区 -->
      <div class="main-content">
        <el-checkbox :model-value="task.completed" @update:model-value="toggleTask" />
        <span class="task-title">{{ task.title }}</span>
        <el-button type="danger" size="small" @click.stop="deleteTask"> 删除 </el-button>
      </div>

      <!-- 展开详情 -->
      <transition name="el-zoom-in-top">
        <div v-show="isExpanded" class="task-details">
          <div class="time-info">
            <el-icon><clock /></el-icon>
            <span class="time-text">
              {{ formatTime(task.startTime) }} -
              {{ formatTime(task.endTime) }}
            </span>
          </div>
          <div class="duration-info">
            <el-icon><timer /></el-icon>
            <span class="duration-text"> 持续时间：{{ calculateDuration(task) }} </span>
          </div>
          <div class="category-info">
            <el-icon><collection /></el-icon>
            <span class="category-text">{{ task.category }}</span>
          </div>
        </div>
      </transition>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { TomatoTask } from '@/types/tasks'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { Clock, Timer, Collection } from '@element-plus/icons-vue'
import { useTaskStore } from '@/stores/tasks'

const props = defineProps<{
  task: Omit<TomatoTask, 'startTime' | 'endTime'> & {
    startTime: number
    endTime: number
  }
}>()

const emit = defineEmits(['delete'])
const taskStore = useTaskStore()
const isExpanded = ref(false)

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 时间格式化函数（添加空值处理）
const formatTime = (timestamp: number) => {
  if (!timestamp) return '未设置'
  return new Date(timestamp)
    .toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(/\//g, '-')
}

// 计算持续时间（添加有效性检查）
const calculateDuration = (task: typeof props.task) => {
  if (!task.startTime || !task.endTime) return '无效时长'
  const duration = (task.endTime - task.startTime) / 1000 / 60
  return `${Math.round(duration)} 分钟`
}
// 删除任务
const deleteTask = () => {
  emit('delete', props.task.id)
}

// 切换任务状态
const toggleTask = () => {
  taskStore.updateTask(props.task.id, {
    completed: !props.task.completed,
  })
}

// 计时器逻辑
const checkTimer = ref<number>()
// 添加生命周期钩子
onMounted(() => {
  setupEndTimeCheck()
})

onBeforeUnmount(() => {
  clearTimeout(checkTimer.value)
})

// 添加监听器
watch(
  () => props.task.completed,
  (newVal) => {
    if (!newVal) {
      setupEndTimeCheck()
    }
  },
)

// 添加时间检查方法
const setupEndTimeCheck = () => {
  if (props.task.completed || !props.task.endTime) return

  const now = Date.now()
  const endTime = props.task.endTime
  const timeLeft = endTime - now

  if (timeLeft <= 0) {
    handleTaskExpired()
    return
  }

  checkTimer.value = setTimeout(() => {
    handleTaskExpired()
  }, timeLeft)
}

// 添加到期处理函数
const handleTaskExpired = () => {
  if (props.task.completed) return

  taskStore.updateTask(props.task.id, {
    completed: true,
  })

  ElNotification({
    title: '任务到期',
    message: `任务 "${props.task.title}" 已到期`,
    type: 'success',
    duration: 5000,
  })
}
</script>

<style scoped>
.task-card {
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.task-card.expanded {
  margin-bottom: 16px;
}

.main-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.task-title {
  flex: 1;
  font-size: 14px;
}

.task-details {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-light);
}

.time-info,
.duration-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-top: 8px;
}

.el-icon {
  font-size: 14px;
}

.time-text {
  font-family: monospace;
}

.duration-text {
  font-weight: 500;
  color: var(--el-color-primary);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-color-success);
  margin-top: 8px;
}
</style>
