<!-- src\views\layout\MainLayout.vue -->
<template>
  <!-- 用户信息栏 -->
  <div class="user-info-bar">
    <div class="user-profile" @click="navigateToProfile">
      <el-avatar :size="36" :src="userInfo.avatar" class="user-avatar" />
      <span class="username">{{ userInfo.username }}</span>
      <el-icon class="arrow-icon"><ArrowRight /></el-icon>
    </div>
  </div>
  <el-container class="main-layout">
    <!-- 左侧导航栏 -->
    <el-aside width="200px" class="sidebar">
      <!-- 带图标的导航菜单 -->
      <el-menu router :default-active="$route.path" active-text-color="#ff5252" class="nav-menu">
        <!-- 导航项1：工作模式 -->
        <el-menu-item index="/work">
          <el-icon><Briefcase /></el-icon>
          <span>工作模式</span>
        </el-menu-item>

        <!-- 导航项2：睡眠管理(暂时废弃)
        <el-menu-item index="/sleep">
          <el-icon><Moon /></el-icon>
          <span>睡眠管理</span>
        </el-menu-item> -->

        <!-- 导航项3：数据统计 -->
        <el-menu-item index="/DataStats">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据统计</span>
        </el-menu-item>

        <!-- 导航项4：个人中心 -->
        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容区 -->
    <el-main class="content-area">
      <!-- 路由视图容器 -->
      <router-view />
      <!-- 确保包含此行 -->
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
// 引入 Element Plus 图标组件
import { Briefcase, Moon, DataAnalysis, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

// 引入 Element Plus 布局组件
import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem, ElIcon } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => ({
  username: userStore.username || '用户名',
  avatar: userStore.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
}))

// 导航到个人中心
const navigateToProfile = () => {
  router.push('/profile')
}
</script>

<style scoped>
.user-info-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
}
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 8px 16px;
  border-radius: 8px;
}

.user-profile:hover {
  background: #f5f7fa;
}

.user-profile:hover .username {
  color: #409eff;
}

.username {
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}
.arrow-icon {
  color: #909399;
  font-size: 14px;
}

.main-layout {
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e4e7ed;
}

.nav-menu {
  border-right: none;
}

.content-area {
  padding: 20px;
  background: #ffffff;
  margin: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 菜单项悬停效果 */
.el-menu-item:hover {
  background-color: #f5f7fa !important;
}

/* 激活菜单项样式 */
.el-menu-item.is-active {
  background-color: #fff5f5 !important;
  font-weight: 500;
}
</style>
