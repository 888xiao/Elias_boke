<template>
  <div class="container">
    <h2>后台管理</h2>
    
    <!-- 文章表单 -->
    <div class="card admin-form">
      <h3>{{ editingPost ? '编辑文章' : '新建文章' }}</h3>
      <div class="form-group">
        <label for="title">标题</label>
        <input type="text" id="title" v-model="form.title" placeholder="请输入文章标题">
      </div>
      <div class="form-group">
        <label for="content">内容（Markdown）</label>
        <textarea id="content" v-model="form.content" placeholder="请输入文章内容（支持 Markdown）"></textarea>
      </div>
      <div class="form-group">
        <label for="tags">标签（用空格或逗号分隔）</label>
        <input type="text" id="tags" v-model="form.tags" placeholder="例如：Vue JavaScript 前端">
      </div>
      <div class="form-group">
        <label for="cover_image">封面图</label>
        <input type="text" id="cover_image" v-model="form.cover_image" placeholder="请输入封面图 URL">
        <input type="file" id="cover_image_upload" accept="image/*" @change="handleImageUpload">
        <div v-if="uploading" class="uploading">上传中...</div>
      </div>
      <div class="form-actions">
        <button @click="savePost">保存</button>
        <button v-if="editingPost" @click="cancelEdit" style="margin-left: 10px; background-color: #999;">取消</button>
      </div>
      <div v-if="message" :class="message.type === 'success' ? 'success' : 'error'">
        {{ message.text }}
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="card">
      <h3>文章列表</h3>
      <div v-if="posts.length === 0">
        <p>暂无文章</p>
      </div>
      <div v-else>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="border-bottom: 1px solid #ddd;">
              <th style="text-align: left; padding: 10px;">标题</th>
              <th style="text-align: left; padding: 10px;">创建时间</th>
              <th style="text-align: right; padding: 10px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id" style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px;">{{ post.title }}</td>
              <td style="padding: 10px;">{{ post.created_at }}</td>
              <td style="text-align: right; padding: 10px;">
                <button @click="editPost(post)" style="margin-right: 5px;">编辑</button>
                <button @click="deletePost(post.id)" style="background-color: #e74c3c;">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 导入 Supabase 客户端
import supabase from '../supabase'

// 文章列表
const posts = ref([])

const form = ref({
  title: '',
  content: '',
  tags: '',
  cover_image: ''
})

const editingPost = ref(null)
const message = ref(null)
const loading = ref(false)
const uploading = ref(false)

// 加载文章列表
const loadPosts = async () => {
  loading.value = true
  try {
    // 从 Supabase 获取数据
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    posts.value = data
  } catch (error) {
    message.value = { type: 'error', text: '加载文章失败: ' + error.message }
  } finally {
    loading.value = false
  }
}

// 保存文章
const savePost = async () => {
  if (!form.value.title || !form.value.content) {
    message.value = { type: 'error', text: '标题和内容不能为空' }
    return
  }

  loading.value = true
  try {
    if (editingPost.value) {
      // 编辑现有文章
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: form.value.title,
          content: form.value.content,
          tags: form.value.tags,
          cover_image: form.value.cover_image
        })
        .eq('id', editingPost.value.id)
        .single()
      
      if (error) {
        throw error
      }
      
      // 更新本地数据
      const index = posts.value.findIndex(p => p.id === editingPost.value.id)
      posts.value[index] = data
      message.value = { type: 'success', text: '文章更新成功' }
      cancelEdit()
    } else {
      // 创建新文章
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: form.value.title,
          content: form.value.content,
          tags: form.value.tags,
          cover_image: form.value.cover_image
        })
        .single()
      
      if (error) {
        throw error
      }
      
      // 添加到本地数据
      posts.value.unshift(data)
      message.value = { type: 'success', text: '文章创建成功' }
      // 重置表单
      form.value = {
        title: '',
        content: '',
        cover_image: ''
      }
    }
  } catch (error) {
    message.value = { type: 'error', text: '保存文章失败: ' + error.message }
  } finally {
    loading.value = false
  }

  // 3秒后清除消息
  setTimeout(() => {
    message.value = null
  }, 3000)
}

// 编辑文章
const editPost = (post) => {
  editingPost.value = post
  form.value = { ...post }
}

// 取消编辑
const cancelEdit = () => {
  editingPost.value = null
  form.value = {
    title: '',
    content: '',
    tags: '',
    cover_image: ''
  }
}

// 删除文章
const deletePost = async (id) => {
  if (confirm('确定要删除这篇文章吗？')) {
    loading.value = true
    try {
      // 从 Supabase 删除数据
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // 从本地数据中删除
      posts.value = posts.value.filter(p => p.id !== id)
      message.value = { type: 'success', text: '文章删除成功' }
    } catch (error) {
      message.value = { type: 'error', text: '删除文章失败: ' + error.message }
    } finally {
      loading.value = false
    }

    // 3秒后清除消息
    setTimeout(() => {
      message.value = null
    }, 3000)
  }
}

// 处理封面图上传
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      throw new Error('请上传图片文件')
    }

    // 生成文件名
    const fileName = `cover_${Date.now()}_${file.name}`
    
    // 上传到 Supabase 存储
    const { error: uploadError } = await supabase
      .storage
      .from('covers')
      .upload(fileName, file)
    
    if (uploadError) {
      throw uploadError
    }
    
    // 获取上传后的文件 URL
    const { data: urlData } = supabase
      .storage
      .from('covers')
      .getPublicUrl(fileName)
    
    form.value.cover_image = urlData.publicUrl
    uploading.value = false
    message.value = { type: 'success', text: '封面图上传成功' }
    
    // 3秒后清除消息
    setTimeout(() => {
      message.value = null
    }, 3000)
  } catch (error) {
    message.value = { type: 'error', text: '封面图上传失败: ' + error.message }
    uploading.value = false
  }
}

// 组件挂载时加载文章列表
onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.form-actions {
  margin-top: 20px;
  text-align: right;
}

#cover_image_upload {
  margin-top: 10px;
  margin-bottom: 10px;
}

.uploading {
  color: #42b983;
  font-size: 0.9em;
  margin-top: 5px;
}
</style>