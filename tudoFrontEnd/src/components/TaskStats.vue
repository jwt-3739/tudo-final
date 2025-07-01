<template>
  <div class="chart-container">
    <div ref="chartRef" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { useTaskStore } from '@/stores/tasks'

const taskStore = useTaskStore()
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 计算分类时间数据
const chartData = computed(() => {
  const categoryMap = new Map<string, number>()

  taskStore.tasks.forEach((task) => {
    if (!task.startTime || !task.endTime) return
    const duration = task.endTime - task.startTime
    const total = categoryMap.get(task.category) || 0
    categoryMap.set(task.category, total + duration)
  })

  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value: Math.round(value / 1000 / 60), // 转换为分钟
  }))
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  const option = {
    title: {
      text: '任务分类时间占比',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}分钟 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: chartData.value.map((item) => item.name),
    },
    series: [
      {
        name: '时间占比',
        type: 'pie',
        radius: '50%',
        data: chartData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          formatter: '{b}: {d}%',
        },
      },
    ],
  }

  chart.setOption(option)
}

// 响应式更新
watch(chartData, () => {
  if (chart) {
    chart.setOption({
      legend: { data: chartData.value.map((item) => item.name) },
      series: [{ data: chartData.value }],
    })
  }
})

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart?.resize())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => chart?.resize())
  chart?.dispose()
})
</script>

<style scoped>
.chart-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}
</style>
