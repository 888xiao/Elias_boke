<template>
  <div class="container">
    <!-- 阅读进度条 -->
    <div class="reading-progress" :style="{ width: readingProgress + '%' }"></div>
    
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">加载失败: {{ error }}</div>
    <div v-else-if="post" class="card post-detail-card">
      <h2 class="post-title">{{ post.title }}</h2>
      <div class="post-tags" v-if="post.tags">
        <span v-for="tag in parseTags(post.tags)" :key="tag" class="tag">#{{ tag }}</span>
      </div>
      <div class="post-meta">
        <span class="publish-time">发布时间：{{ formatDateTime(post.created_at) }}</span>
        <span v-if="shouldShowUpdatedAt(post.created_at, post.updated_at)" class="update-time">最后编辑：{{ formatDateTime(post.updated_at) }}</span>
      </div>
      <div v-if="post.cover_image" class="post-cover">
        <img :src="post.cover_image" alt="封面图" loading="lazy">
      </div>
      <div class="post-content" v-html="renderedContent"></div>
      
      <!-- 作者信息 -->
      <div class="author-section">
        <div class="author-avatar">
          <img :src="authorInfo.avatarUrl" alt="作者头像" id="author-avatar">
        </div>
        <div class="author-info">
          <p class="author-name" id="author-name">{{ authorInfo.username }}</p>
          <p class="author-email">wdx18663018840@qq.com</p>
          <p class="author-welcome">感谢阅读！欢迎交流讨论，一起进步！</p>
          <div class="author-edit" v-if="user">
            <button @click="showEditModal = true" style="margin-top: 10px; font-size: 0.8em; padding: 6px 12px;">编辑作者信息</button>
          </div>
        </div>
        
        <!-- 编辑作者信息弹窗 -->
        <div v-if="showEditModal" class="modal-overlay">
          <div class="modal-content">
            <h3>编辑作者信息</h3>
            <div class="form-group">
              <label for="github-username">GitHub 用户名</label>
              <input type="text" id="github-username" v-model="authorInfo.username" placeholder="请输入 GitHub 用户名">
            </div>
            <div class="form-group">
              <label for="custom-avatar">自定义头像 URL (可选)</label>
              <input type="text" id="custom-avatar" v-model="authorInfo.avatarUrl" placeholder="请输入头像 URL，留空则使用 GitHub 头像">
            </div>
            <div class="modal-actions">
              <button @click="saveAuthorInfo">保存</button>
              <button @click="showEditModal = false" style="margin-left: 10px; background-color: #999;">取消</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Giscus 评论系统 -->
      <div class="comments-section">
        <h3>评论</h3>
        <div class="giscus-container" ref="giscusContainer"></div>
      </div>
      
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>
    <div v-else>
      <p>文章不存在</p>
      <router-link to="/" class="back-link">返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import supabase from '../supabase'

const route = useRoute()
const postId = Number(route.params.id)

const post = ref(null)
const loading = ref(false)
const error = ref(null)
const readingProgress = ref(0)
const user = ref(null)
const showEditModal = ref(false)
const authorInfo = ref({
  username: 'GitHub 用户名',
  avatarUrl: 'https://github.com/username.png'
})
const giscusContainer = ref(null)
let giscusScriptLoaded = false

const parseTags = (tags) => {
  if (!tags) return []
  return tags.split(/[,\s]+/).filter(tag => tag.trim())
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const shouldShowUpdatedAt = (createdAt, updatedAt) => {
  if (!createdAt || !updatedAt) return false
  const created = new Date(createdAt).getTime()
  const updated = new Date(updatedAt).getTime()
  return (updated - created) > 60000 // 1分钟
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return hljs.highlightAuto(str).value
  }
})

const renderedContent = computed(() => {
  if (!post.value) return ''
  return md.render(post.value.content)
})

// 计算阅读进度
const updateReadingProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = (scrollTop / docHeight) * 100
}

const checkUser = async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  user.value = currentUser
}

const loadAuthorInfo = () => {
  const savedInfo = localStorage.getItem('authorInfo')
  if (savedInfo) {
    authorInfo.value = JSON.parse(savedInfo)
  }
}

const saveAuthorInfo = () => {
  // 如果没有设置自定义头像且有 GitHub 用户名，则使用 GitHub 头像
  if (!authorInfo.value.avatarUrl && authorInfo.value.username) {
    authorInfo.value.avatarUrl = `https://github.com/${authorInfo.value.username}.png`
  }
  localStorage.setItem('authorInfo', JSON.stringify(authorInfo.value))
  showEditModal.value = false
}

const highlightCode = () => {
  setTimeout(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block)
    })
  }, 100)
}

const loadGiscus = () => {
  if (giscusScriptLoaded || !giscusContainer.value) return
  
  giscusScriptLoaded = true
  
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', '888xiao/Discussion888')
  script.setAttribute('data-repo-id', 'R_kgDORieBfA')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDORieBfM4C5Up7')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', 'preferred_color_scheme')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true
  
  giscusContainer.value.appendChild(script)
}

const loadPostDetail = async () => {
  loading.value = true
  try {
    const { data, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()
    
    if (fetchError) {
      throw fetchError
    }
    
    post.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
    highlightCode()
  }
}

onMounted(async () => {
  await checkUser()
  loadAuthorInfo()
  loadPostDetail()
  loadGiscus()
  window.addEventListener('scroll', updateReadingProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--primary-color);
  z-index: 1000;
  transition: width 0.1s ease;
}

.post-detail-card {
  position: relative;
}

.post-title {
  font-size: 1.8em;
  margin-bottom: 15px;
  line-height: 1.4;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.8em;
}

.post-meta {
  font-size: 0.9em;
  color: var(--text-secondary);
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.publish-time,
.update-time {
  display: inline-block;
}

.update-time {
  color: var(--text-tertiary);
}

.post-cover {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 25px;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  text-align: left;
  line-height: 1.8;
  color: var(--text-primary);
}

.post-content :deep(h2) {
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 1.5em;
  color: var(--text-primary);
}

.post-content :deep(h3) {
  margin-top: 25px;
  margin-bottom: 15px;
  font-size: 1.2em;
  color: var(--text-primary);
}

.post-content :deep(p) {
  margin-bottom: 15px;
  line-height: 1.8;
}

.post-content :deep(code) {
  background-color: var(--code-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9em;
}

.post-content :deep(pre) {
  background-color: #282c34; /* atom-one-dark 主题背景色 */
  border: 2px solid var(--primary-color);
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 20px;
  position: relative;
}

/* 确保代码块在移动端可横向滚动 */
.post-content :deep(pre) {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.post-content :deep(pre)::-webkit-scrollbar {
  height: 8px;
}

.post-content :deep(pre)::-webkit-scrollbar-track {
  background: #282c34;
  border-radius: 4px;
}

.post-content :deep(pre)::-webkit-scrollbar-thumb {
  background: var(--text-tertiary);
  border-radius: 4px;
}

.post-content :deep(pre)::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.post-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border: none;
}

.post-content :deep(ul), .post-content :deep(ol) {
  margin-bottom: 15px;
  padding-left: 30px;
}

.post-content :deep(li) {
  margin-bottom: 8px;
}

.post-content :deep(blockquote) {
  border-left: 4px solid var(--primary-color);
  padding-left: 20px;
  margin: 20px 0;
  color: var(--text-secondary);
}

.post-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 15px 0;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding: 25px;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.author-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-primary);
}

.author-email {
  font-size: 0.9em;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.author-welcome {
  font-size: 0.95em;
  color: var(--text-secondary);
  font-style: italic;
}

.back-link {
  display: inline-block;
  margin-top: 30px;
  font-weight: 500;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .author-section {
    flex-direction: column;
    text-align: center;
  }
  
  .post-title {
    font-size: 1.5em;
  }
  
  .modal-content {
    width: 90%;
    max-width: 400px;
  }
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-color);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.author-edit {
  margin-top: 10px;
}

/* 评论区样式 */
.comments-section {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid var(--border-color);
}

.comments-section h3 {
  font-size: 1.3em;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.giscus-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .comments-section {
    margin-top: 40px;
    padding-top: 20px;
  }
}
</style>