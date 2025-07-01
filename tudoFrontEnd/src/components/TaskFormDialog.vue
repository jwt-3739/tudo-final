<!-- components/TaskFormDialog.vue -->
<template>
  <el-dialog v-model="visible" title="任务设置" width="500px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="任务名称">
        <el-input v-model="form.title" disabled />
      </el-form-item>
      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="x"
        />
      </el-form-item>
      <el-form-item label="结束时间" required>
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="选择结束时间"
          value-format="x"
          :disabled-date="disabledEndDate"
        />
      </el-form-item>
      <el-form-item label="任务分类" required>
        <el-select v-model="form.category" filterable allow-create placeholder="选择或输入分类">
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTaskCreator } from '@/tools/CreateTask'

const props = defineProps<{
  initialTitle: string
  categories: string[]
}>()

const emit = defineEmits(['submit'])
const { createTask } = useTaskCreator()

const visible = ref(false)
const form = ref({
  title: props.initialTitle,
  startTime: null as number | null,
  endTime: null as number | null,
  category: '工作', // 默认分类
})

// 禁用早于开始时间的日期
const disabledEndDate = (date: Date) => {
  return form.value.startTime ? date.getTime() < form.value.startTime : false
}

const open = () => {
  form.value.title = props.initialTitle
  form.value.startTime = null
  form.value.endTime = null
  visible.value = true // 确保 visible 被正确设置
}

const handleConfirm = () => {
  if (!form.value.category) {
    ElMessage.warning('请选择任务分类')
    return
  }

  createTask({
    title: form.value.title,
    startTime: form.value.startTime!,
    endTime: form.value.endTime!,
    category: form.value.category,
  })

  visible.value = false
  emit('submit') // 触发父组件更新
}

defineExpose({ open })
</script>
