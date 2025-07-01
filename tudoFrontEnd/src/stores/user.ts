// src\stores\user.ts
// import { defineStore } from 'pinia'

// export const useUserStore = defineStore('user', {
//   state: () => ({
//     username: '当前用户',
//     avatar: '',
//   }),
//   actions: {
//     updateUsername(newName: string) {
//       this.username = newName
//     },
//     updateAvatar(newAvatar: string) {
//       this.avatar = newAvatar
//     },
//   },
// })

// src/stores/user.ts
import { defineStore } from 'pinia'
import axios, { type AxiosError } from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '当前用户',
    avatar: '',
  }),
  actions: {
    // 注册方法
    async register(userData: { username: string; password: string }) {
      try {
        const response = await axios.post('http://localhost:5000/register', userData)
        console.log('注册成功:', response.data)
        return true
      } catch (error: any) {
        const message = error.response?.data || '注册失败，请检查网络连接'
        throw new Error(message)
      }
    },

    // 优化后的登录方法
    async login(userData: { username: string; password: string }) {
      try {
        const response = await axios.post('http://localhost:5000/login', userData, {
          timeout: 5000 // 增加超时设置
        })
        
        // 严格校验返回数据结构
        if (!response.data.token) {
          throw new Error('服务器返回格式异常')
        }

        // 更新状态
        this.username = response.data.username
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', this.username)
        
        return true
      } catch (error: any) {
        // 细化错误类型判断
        let message = '登录失败'
        if (error.response) {
          // 服务器返回的错误
          message = error.response.data.message || `服务器错误 (${error.response.status})`
        } else if (error.request) {
          // 请求已发出但无响应
          message = '网络连接异常，请检查服务器状态'
        } else {
          // 其他错误
          message = error.message || '未知错误'
        }
        throw new Error(message)
      }
    },

    async fetchUser(username: string) {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${username}`)
        this.username = response.data.username
        this.avatar = response.data.avatar
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    },
    async updateUsername(newName: string) {
      try {
        const oldUsername = this.username;
        await axios.put(`http://localhost:5000/api/users/${oldUsername}`, {
          username: newName,
        });
        this.username = newName; // 更新本地存储的用户名
      } catch (error) {
        console.error('Failed to update username:', error);
      }
    },
    async updateAvatar(newAvatar: string) {
      try {
        await axios.put(`http://localhost:5000/api/users/${this.username}`, {
          avatar: newAvatar,
        })
        this.avatar = newAvatar
      } catch (error) {
        console.error('Failed to update avatar:', error)
      }
    },
  },
})
