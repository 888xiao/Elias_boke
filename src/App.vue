<template>
  <div id="app">
    <header class="site-header">
      <div class="header-container">
        <h1 class="site-title">
          <router-link to="/">Elias的博客</router-link>
        </h1>
        
        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMenu" aria-label="切换菜单">
          <span class="menu-icon">{{ isMenuOpen ? '✕' : '☰' }}</span>
        </button>
        
        <!-- 导航菜单 -->
        <nav class="main-nav" :class="{ 'nav-open': isMenuOpen }">
          <router-link to="/" @click="closeMenu">首页</router-link>
          <router-link to="/about" @click="closeMenu">关于</router-link>
          <template v-if="user">
            <router-link to="/admin" @click="closeMenu">后台管理</router-link>
            <a href="#" @click.prevent="logout">退出登录</a>
          </template>
          <template v-else>
            <router-link to="/login" @click="closeMenu">登录</router-link>
          </template>
          
          <!-- 暗色模式切换 -->
          <button class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="site-footer">
      <p>&copy; {{ new Date().getFullYear() }} Elias的博客</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import supabase from './supabase'

const router = useRouter()
const user = ref(null)
const isMenuOpen = ref(false)
const isDark = ref(false)

// 检查用户登录状态
const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  user.value = currentUser
}

// 退出登录
const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    user.value = null
    closeMenu()
    router.push('/')
  }
}

// 菜单控制
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// 暗色模式控制
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
}

const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme()
}

// 监听系统主题变化
watch(() => window.matchMedia('(prefers-color-scheme: dark)').matches, (matches) => {
  if (!localStorage.getItem('theme')) {
    isDark.value = matches
    applyTheme()
  }
})

// 监听认证状态变化
supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user || null
})

// 组件挂载时初始化
onMounted(() => {
  checkUser()
  initTheme()
})
</script>

<style scoped>
.site-header {
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.site-title {
  font-size: 1.5em;
  margin: 0;
}

.site-title a {
  color: var(--nav-text);
  text-decoration: none;
  font-weight: 600;
}

.site-title a:hover {
  color: var(--primary-color);
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 25px;
}

.main-nav a {
  color: var(--nav-text);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.2s ease;
}

.main-nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.2s ease;
}

.main-nav a:hover::after,
.main-nav a.router-link-active::after {
  width: 100%;
}

.main-nav a.router-link-active {
  color: var(--primary-color);
}

.theme-toggle-btn {
  background: transparent;
  border: 2px solid var(--border-color);
  color: var(--nav-text);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover {
  border-color: var(--primary-color);
  transform: scale(1.1);
}

.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--nav-text);
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.mobile-menu-btn:hover {
  background: var(--card-bg);
}

.main-content {
  flex: 1;
  padding: 30px 0;
}

.site-footer {
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: 30px 20px;
  text-align: center;
  color: var(--text-secondary);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .header-container {
    height: 56px;
  }
  
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .main-nav {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    background: var(--nav-bg);
    flex-direction: column;
    padding: 20px;
    gap: 15px;
    border-bottom: 1px solid var(--border-color);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 99;
  }
  
  .main-nav.nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .main-nav a {
    width: 100%;
    padding: 12px 0;
    text-align: center;
    border-bottom: 1px solid var(--border-color);
  }
  
  .main-nav a:last-of-type {
    border-bottom: none;
  }
  
  .main-nav a::after {
    display: none;
  }
  
  .theme-toggle-btn {
    margin-top: 10px;
  }
  
  .site-title {
    font-size: 1.3em;
  }
  
  .main-content {
    padding: 20px 0;
  }
}
</style>