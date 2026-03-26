<template>
  <div class="container">
    <div class="card admin-form" style="max-width: 400px;">
      <h2>管理员登录</h2>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="email" id="email" v-model="form.email" placeholder="请输入管理员邮箱">
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="form.password" placeholder="请输入密码">
      </div>
      <div class="form-actions">
        <button @click="login" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
      <div v-if="message" :class="message.type === 'success' ? 'success' : 'error'">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import supabase from '../supabase'

const router = useRouter()
const form = ref({
  email: '',
  password: ''
})
const loading = ref(false)
const message = ref(null)

const login = async () => {
  if (!form.value.email || !form.value.password) {
    message.value = { type: 'error', text: '邮箱和密码不能为空' }
    return
  }

  loading.value = true
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    })

    if (error) {
      throw error
    }

    message.value = { type: 'success', text: '登录成功' }
    setTimeout(() => {
      router.push('/admin')
    }, 1000)
  } catch (error) {
    message.value = { type: 'error', text: '登录失败: ' + error.message }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-actions {
  margin-top: 20px;
  text-align: right;
}
</style>