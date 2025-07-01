<!-- src\views\layout\modules\profile.vue -->
<template>
  <div class="profile-container">
    <!-- 头像上传模块 -->
    <el-card class="profile-section">
      <template #header>
        <div class="card-header">
          <span>头像设置</span>
        </div>
      </template>
      <div class="avatar-upload">
        <el-upload
          class="avatar-uploader"
          action="/api/uploadAvatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <div class="upload-tip">点击上传新头像（建议尺寸 200x200）</div>
      </div>
    </el-card>

    <!-- 用户名修改模块 -->
    <el-card class="profile-section">
      <template #header>
        <div class="card-header">
          <span>修改用户名</span>
        </div>
      </template>
      <el-form
        :model="usernameForm"
        :rules="usernameRules"
        ref="usernameFormRef"
        @submit.prevent="submitUsername"
      >
        <el-form-item label="当前用户名">
          <el-input :model-value="userStore.username" disabled />
        </el-form-item>
        <el-form-item label="新用户名" prop="newUsername">
          <el-input v-model="usernameForm.newUsername" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">提交修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 密码修改模块 -->
    <el-card class="profile-section">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        @submit.prevent="submitPassword"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">提交修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 头像上传逻辑
const avatarUrl = ref(
  userStore.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
)

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // 假设接口返回新头像URL，根据实际响应结构调整
  const newAvatarUrl = response.data?.url || URL.createObjectURL(response.raw)
  avatarUrl.value = newAvatarUrl
  userStore.updateAvatar(newAvatarUrl)
  ElMessage.success('头像更新成功')
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 用户名修改逻辑
const usernameFormRef = ref<FormInstance>()
const usernameForm = reactive({
  newUsername: '',
})

const usernameRules = {
  newUsername: [
    { required: true, message: '请输入新用户名', trigger: 'blur' },
    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' },
  ],
}

const submitUsername = () => {
  usernameFormRef.value?.validate((valid) => {
    if (valid) {
      userStore.updateUsername(usernameForm.newUsername)
      ElMessage.success('用户名修改成功')
      usernameForm.newUsername = ''
    }
  })
}

// 密码修改逻辑
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value.length < 6) {
    callback(new Error('密码不能少于6位'))
  } else if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    callback(new Error('密码必须包含字母和数字'))
  } else {
    callback()
  }
}

const validateConfirm = (rule: any, value: string, callback: any) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [{ required: true, validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validateConfirm, trigger: 'blur' }],
}

const submitPassword = () => {
  passwordFormRef.value?.validate((valid) => {
    if (valid) {
      // 这里调用API
      ElMessage.success('密码修改请求已提交')
      passwordFormRef.value?.resetFields()
    }
  })
}
</script>

<style scoped>
/* 保持原有样式不变 */
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-section {
  margin-bottom: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: 500;
}

.avatar-upload {
  text-align: center;
}

.avatar-uploader {
  display: inline-block;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.3s;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 10px;
}

.el-form {
  max-width: 500px;
}
</style>
