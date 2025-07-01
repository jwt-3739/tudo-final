import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/views/layout/MainLayout.vue'),
      meta: { requiresAuth: true }, // 整个布局需要登录
      children: [
        {
          path: '',
          name: 'welcome',
          component: () => import('@/views/layout/modules/EmptyView.vue'),
          meta: { title: '欢迎页' }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/') // 已登录用户访问登录页时重定向到首页
  } else {
    next()
  }
})

export default router