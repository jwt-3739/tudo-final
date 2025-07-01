<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="login-header">
          <h1>用户登录</h1>
        </div>
      </template>

      <el-form ref="loginForm" :model="form" :rules="rules" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" class="login-btn"> 立即登录 </el-button>
        </el-form-item>

        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          show-icon
          closable
          @close="errorMessage = ''"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElAlert } from 'element-plus'

// 新增引入
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router' // 新增引入

const router = useRouter() // 新增路由实例

const userStore = useUserStore()

interface LoginForm {
  username: string
  password: string
}

// 表单实例
const loginForm = ref<FormInstance>()

// 响应式数据
const form = ref<LoginForm>({
  username: '',
  password: '',
})

const errorMessage = ref('')

// 验证规则
const rules = ref<FormRules<LoginForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
  ],
})

const handleLogin = async () => {
  try {
    await loginForm.value?.validate()
    const response = await userStore.login({
      username: form.value.username,
      password: form.value.password,
    })
    
    localStorage.setItem('token', response.token)
    ElMessage.success(`欢迎回来，${form.value.username}！`)
    router.push('/') // 改为跳转到根路径（即欢迎页）
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '登录失败，请检查用户名和密码'
  }
}
</script>

<style scoped>
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.login-card {
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  padding: 10px 0;
}

.login-header h1 {
  font-size: 24px;
  color: #303133;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

:deep(.el-input__inner) {
  height: 40px;
}
</style>
