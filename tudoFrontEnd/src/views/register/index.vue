<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="register-header">
          <h1>用户注册</h1>
        </div>
      </template>

      <el-form ref="registerForm" :model="form" :rules="rules" @submit.prevent="handleRegister">
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

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            placeholder="请确认密码"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" class="register-btn"> 立即注册 </el-button>
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
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
// 新增引入
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
}

// 表单实例
const registerForm = ref<FormInstance>()
const errorMessage = ref('')

// 响应式数据
const form = ref<RegisterForm>({
  username: '',
  password: '',
  confirmPassword: '',
})

// 验证规则
const validatePassword = (rule: any, value: string, callback: Function) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = ref<FormRules<RegisterForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能少于3个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
})

// 注册处理

// 修改注册处理函数
const handleRegister = async () => {
  try {
    await registerForm.value?.validate()

    // 调用 Pinia 的注册方法
    await userStore.register({
      username: form.value.username,
      password: form.value.password,
    })

    ElMessage.success(`注册成功！欢迎 ${form.value.username}`)

    // 清空表单
    form.value = { username: '', password: '', confirmPassword: '' }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '注册失败，请稍后重试'
  }
}
</script>

<style scoped>
.register-container {
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

.register-card {
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  padding: 10px 0;
}

.register-header h1 {
  font-size: 24px;
  color: #303133;
}

.register-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

:deep(.el-input__inner) {
  height: 40px;
}

@media (max-width: 768px) {
  .register-card {
    width: 90%;
    margin: 0 5%;
  }
}
</style>
