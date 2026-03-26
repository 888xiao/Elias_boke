<template>
  <div class="container">
    <h2>文章列表</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">加载失败: {{ error }}</div>
    <div v-else class="posts-grid">
      <div v-if="posts.length === 0" class="card">
        <p>暂无文章</p>
      </div>
      <div v-for="post in posts" :key="post.id" class="card post-card">
        <div v-if="post.cover_image" class="post-cover">
          <img :src="post.cover_image" alt="封面图" loading="lazy">
        </div>
        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <div class="post-tags" v-if="post.tags">
            <span v-for="tag in parseTags(post.tags)" :key="tag" class="tag">#{{ tag }}</span>
          </div>
          <div class="post-meta">
            <span>{{ formatDate(post.created_at) }}</span>
          </div>
          <div class="post-excerpt">{{ post.content.substring(0, 100) }}...</div>
          <router-link :to="`/post/${post.id}`" class="read-more">阅读全文</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import supabase from '../supabase'

const posts = ref([])
const loading = ref(false)
const error = ref(null)

const parseTags = (tags) => {
  if (!tags) return []
  return tags.split(/[,\s]+/).filter(tag => tag.trim())
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const loadPosts = async () => {
  loading.value = true
  try {
    const { data, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      throw fetchError
    }
    
    posts.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.post-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.post-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-title {
  font-size: 1.2em;
  margin-bottom: 10px;
  line-height: 1.4;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  background: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.75em;
}

.post-meta {
  font-size: 0.85em;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.post-excerpt {
  margin: 10px 0;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

.read-more {
  display: inline-block;
  margin-top: 10px;
  font-weight: 500;
  color: var(--primary-color);
}

/* 平板端 */
@media (max-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 手机端 */
@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>