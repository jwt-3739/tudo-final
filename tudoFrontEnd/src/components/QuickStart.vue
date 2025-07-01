<template>
  <el-card class="quick-start">
    <div class="flex items-center gap-4">
      <div class="time-options">
        <el-radio-group v-model="selectedDuration">
          <el-radio-button v-for="time in durations" :key="time.value" :label="time.value">
            {{ time.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <el-button type="primary" @click="handleQuickStart" :disabled="!selectedDuration">
        快速开始
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTaskCreator } from '@/tools/CreateTask'

const emit = defineEmits(['started'])
const { createTask } = useTaskCreator()

const selectedDuration = ref<number>(25 * 60) // 默认25分钟
const durations = [
  { label: '1min', value: 1 * 60 },
  { label: '20min', value: 20 * 60 },
  { label: '25min', value: 25 * 60 },
  { label: '30min', value: 30 * 60 },
]

const handleQuickStart = () => {
  createTask({
    title: '快速任务',
    duration: selectedDuration.value * 1000,
  })

  emit('started', selectedDuration.value)
  selectedDuration.value = 25 * 60
}
</script>
