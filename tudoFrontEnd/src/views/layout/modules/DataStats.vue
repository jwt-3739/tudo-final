<!-- src\views\layout\modules\DataStats.vue -->
<!-- 数据统计模块 -->

<template>
  <div class="work-container">
    <div class="content-wrapper">
      <!-- 原有内容... -->
      <TaskStats />
    </div>
  </div>
</template>

<script setup lang="ts">
// 添加导入
import TaskStats from '@/components/TaskStats.vue'
</script>
