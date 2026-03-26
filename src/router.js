import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Admin from './views/Admin.vue'
import PostDetail from './views/PostDetail.vue'
import Login from './views/Login.vue'
import About from './views/About.vue'
import supabase from './supabase'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // 未登录，重定向到登录页面
      next('/login')
    } else {
      // 已登录，继续访问
      next()
    }
  } else {
    // 不需要认证的路由，直接访问
    next()
  }
})

export default router