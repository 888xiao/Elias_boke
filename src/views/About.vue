<template>
  <div class="container">
    <h2>关于我</h2>
    <div class="about-card card">
      <div class="about-avatar">
        <img :src="authorInfo.avatarUrl" alt="头像" loading="lazy">
      </div>
      <div class="about-content">
        <h3 class="about-name">Elias Christopher</h3>
        <p class="about-github">GitHub: <a href="https://github.com/888xiao" target="_blank">888xiao</a></p>
        <div class="about-bio">
          <h4>自我介绍</h4>
          <p>我是一名热爱技术的开发者，专注于前端开发和全栈技术。</p>
          <p>学习方向：前端框架、响应式设计、用户体验优化</p>
          <p>技术栈：Vue.js、JavaScript、HTML/CSS、Node.js</p>
        </div>
        <div class="about-contact">
          <h4>联系方式</h4>
          <p>邮箱：<a href="mailto:wdx18663018840@qq.com">wdx18663018840@qq.com</a></p>
        </div>
        <div class="about-social">
          <h4>社交链接</h4>
          <div class="social-links">
            <a href="https://github.com/888xiao" target="_blank" class="social-link">
              <span class="social-icon">GitHub</span>
            </a>
            <!-- 可以添加其他社交链接 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const authorInfo = ref({
  username: '888xiao',
  avatarUrl: 'https://github.com/888xiao.png'
})

const loadAuthorInfo = () => {
  const savedInfo = localStorage.getItem('authorInfo')
  if (savedInfo) {
    authorInfo.value = JSON.parse(savedInfo)
  }
}

onMounted(() => {
  loadAuthorInfo()
})
</script>

<style scoped>
.about-card {
  display: flex;
  gap: 40px;
  padding: 30px;
}

.about-avatar {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary-color);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.about-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-content {
  flex: 1;
  text-align: left;
}

.about-name {
  font-size: 1.8em;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.about-github {
  font-size: 1.1em;
  margin-bottom: 25px;
  color: var(--text-secondary);
}

.about-github a {
  color: var(--primary-color);
  font-weight: 500;
}

.about-bio,
.about-contact,
.about-social {
  margin-bottom: 30px;
}

.about-bio h4,
.about-contact h4,
.about-social h4 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: var(--text-primary);
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 5px;
  display: inline-block;
}

.about-bio p {
  margin-bottom: 10px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.about-contact p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.about-contact a {
  color: var(--primary-color);
}

.social-links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.social-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.social-icon {
  margin-right: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-card {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  
  .about-avatar {
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }
  
  .about-content {
    text-align: center;
  }
  
  .about-bio h4,
  .about-contact h4,
  .about-social h4 {
    display: block;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>