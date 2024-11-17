<template>
  <div v-loading="loading" class="tv-detail">
    <!-- 顶部海报区域 -->
    <div class="banner-section">
      <div class="backdrop" :style="{ backgroundImage: `url(${tvShow.backdrop})` }">
        <div class="backdrop-overlay">
          <div class="content-wrapper">
            <div class="poster">
              <el-image :src="tvShow.poster" :alt="tvShow.title" />
            </div>
            <div class="info">
              <h1>{{ tvShow.title }}</h1>
              <div class="meta">
                <span class="year">{{ tvShow.year }}</span>
                <span class="episodes">{{ tvShow.episodes }}集全</span>
                <span class="rating">
                  <font-awesome-icon icon="star" class="star-icon" />
                  {{ tvShow.rating }}
                </span>
              </div>
              <div class="tags">
                <el-tag 
                  v-for="tag in tvShow.tags" 
                  :key="tag"
                  effect="dark"
                  class="tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="actions">
                <el-button type="success" size="large">
                  <font-awesome-icon icon="play" /> 立即播放
                </el-button>
                <el-button type="primary" size="large">
                  <font-awesome-icon icon="plus" /> 加入片单
                </el-button>
                <el-button size="large">
                  <font-awesome-icon icon="share" /> 分享
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <el-tabs class="custom-tabs">
        <!-- 剧集列表 -->
        <el-tab-pane>
          <template #label>
            <span class="tab-label">
              <font-awesome-icon icon="list" /> 剧集列表
            </span>
          </template>
          <div class="episodes-grid">
            <div 
              v-for="episode in episodes" 
              :key="episode.id"
              class="episode-card"
            >
              <div class="episode-thumb">
                <el-image :src="episode.thumb" :alt="episode.title" />
                <div class="episode-overlay">
                  <el-button type="success" circle>
                    <font-awesome-icon icon="play" />
                  </el-button>
                </div>
              </div>
              <div class="episode-info">
                <h3>第{{ episode.number }}集</h3>
                <p>{{ episode.title }}</p>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 剧情简介 -->
        <el-tab-pane>
          <template #label>
            <span class="tab-label">
              <font-awesome-icon icon="info-circle" /> 剧情简介
            </span>
          </template>
          <div class="plot-section">
            <p class="plot">{{ tvShow.plot }}</p>
            <div class="cast">
              <h3>演职人员</h3>
              <div class="cast-list">
                <div 
                  v-for="person in cast" 
                  :key="person.id"
                  class="cast-item"
                >
                  <el-avatar :src="person.avatar" :size="60" />
                  <div class="cast-info">
                    <span class="name">{{ person.name }}</span>
                    <span class="role">{{ person.role }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 评论区 -->
        <el-tab-pane>
          <template #label>
            <span class="tab-label">
              <font-awesome-icon icon="comments" /> 评论区
            </span>
          </template>
          <div class="comments-section">
            <div class="comment-input">
              <el-input
                v-model="commentText"
                type="textarea"
                :rows="3"
                placeholder="发表你的评论..."
              />
              <el-button 
                type="primary"
                :disabled="!commentText.trim()"
                @click="submitComment"
              >
                发表评论
              </el-button>
            </div>
            <div class="comments-list">
              <div 
                v-for="comment in comments" 
                :key="comment.id"
                class="comment-item"
              >
                <el-avatar :src="comment.avatar" />
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="username">{{ comment.username }}</span>
                    <span class="time">{{ comment.time }}</span>
                  </div>
                  <p class="text">{{ comment.content }}</p>
                  <div class="comment-actions">
                    <el-button text type="primary">
                      <font-awesome-icon icon="thumbs-up" /> {{ comment.likes }}
                    </el-button>
                    <el-button text>回复</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 相关推荐部分 -->
    <div class="related-section">
      <h3>相关推荐</h3>
      <div class="related-grid">
        <div 
          v-for="show in relatedShows" 
          :key="show.id"
          class="related-card"
          @click="goToShow(show.id)"
        >
          <div class="related-poster">
            <el-image :src="show.poster" :alt="show.title" />
            <div class="related-overlay">
              <div class="related-rating">
                <font-awesome-icon icon="star" />
                {{ show.rating }}
              </div>
              <el-button type="success" circle>
                <font-awesome-icon icon="play" />
              </el-button>
            </div>
          </div>
          <div class="related-info">
            <h4>{{ show.title }}</h4>
            <div class="related-meta">
              <span>{{ show.year }}</span>
              <span>{{ show.episodes }}集</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tvShowDetails, tvShowsList } from '@/utils/mockData'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const tvShow = ref({})
const episodes = ref([])
const cast = ref([])
const comments = ref([])
const commentText = ref('')
const relatedShows = ref([])

// 获取相关推荐
const getRelatedShows = () => {
  // 这里可以根据当前剧的标签等信息获取相关推荐
  relatedShows.value = tvShowsList.filter(show => 
    show.id !== Number(route.params.id) &&
    show.tags.some(tag => tvShow.value.tags?.includes(tag))
  ).slice(0, 6)
}

// 跳转到其他剧集
const goToShow = (id) => {
  router.push({
    name: 'tvDetail',
    params: { id }
  })
}

onMounted(async () => {
  loading.value = true
  try {
    const showData = tvShowDetails[route.params.id]
    if (showData) {
      tvShow.value = showData
      episodes.value = showData.episodeList || []
      cast.value = showData.actors || []
      comments.value = showData.comments || []
      await getRelatedShows()
    }
  } catch (error) {
    console.error('Failed to load TV show details:', error)
  } finally {
    loading.value = false
  }
})

// 监听路由变化，当参数变化时重新加载数据
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      loading.value = true
      try {
        const showData = tvShowDetails[newId]
        if (showData) {
          tvShow.value = showData
          episodes.value = showData.episodeList || []
          cast.value = showData.actors || []
          comments.value = showData.comments || []
          await getRelatedShows()
        }
      } catch (error) {
        console.error('Failed to load TV show details:', error)
      } finally {
        loading.value = false
      }
    }
  }
)

const submitComment = () => {
  // 提交评论逻辑
}
</script>

<style scoped>
.tv-detail {
  min-height: 100vh;
  background-color: #1a1a1a;
}

.banner-section {
  height: 500px;
  position: relative;
}

.backdrop {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, 
    rgba(26, 26, 26, 0.5) 0%,
    rgba(26, 26, 26, 0.8) 50%,
    #1a1a1a 100%
  );
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  gap: 40px;
  height: 100%;
  align-items: center;
}

.poster {
  width: 250px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.info {
  flex: 1;
  color: #fff;
}

.info h1 {
  font-size: 36px;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 16px;
}

.star-icon {
  color: #F7BA2A;
}

.tags {
  margin-bottom: 30px;
}

.tag {
  margin-right: 10px;
}

.actions {
  display: flex;
  gap: 15px;
}

.content-section {
  max-width: 1200px;
  margin: -60px auto 0;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

.custom-tabs {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 20px;
}

.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.episode-card {
  background: #333;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.episode-card:hover {
  transform: translateY(-5px);
}

.episode-thumb {
  position: relative;
  aspect-ratio: 16/9;
}

.episode-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.episode-card:hover .episode-overlay {
  opacity: 1;
}

.episode-info {
  padding: 15px;
}

.episode-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.episode-info p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.plot-section {
  padding: 20px 0;
}

.plot {
  line-height: 1.8;
  color: #e5e5e5;
}

.cast {
  margin-top: 40px;
}

.cast h3 {
  margin-bottom: 20px;
}

.cast-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.cast-item {
  text-align: center;
}

.cast-info {
  margin-top: 10px;
}

.cast-info .name {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}

.cast-info .role {
  color: #999;
  font-size: 14px;
}

.comments-section {
  padding: 20px 0;
}

.comment-input {
  margin-bottom: 30px;
}

.comment-input .el-button {
  margin-top: 15px;
}

.comment-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.username {
  font-weight: bold;
}

.time {
  color: #999;
  font-size: 14px;
}

.text {
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  gap: 15px;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__item) {
  color: #999;
  font-size: 16px;
}

:deep(.el-tabs__item.is-active) {
  color: #4CAF50;
}

:deep(.el-tabs__active-bar) {
  background-color: #4CAF50;
}

.related-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.related-section h3 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #e5e5e5;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.related-card {
  background: #333;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.related-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.related-poster {
  position: relative;
  aspect-ratio: 2/3;
}

.related-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.related-card:hover .related-overlay {
  opacity: 1;
}

.related-rating {
  color: #F7BA2A;
  font-size: 16px;
}

.related-info {
  padding: 12px;
}

.related-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #e5e5e5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 12px;
}

/* 优化评论区样式 */
.comments-section {
  padding: 20px 0;
}

.comment-input {
  margin-bottom: 30px;
}

.comment-input .el-button {
  margin-top: 15px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
  background: #333;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.comment-item:hover {
  transform: translateX(5px);
  background: #383838;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.username {
  font-weight: bold;
  color: #e5e5e5;
}

.time {
  color: #999;
  font-size: 12px;
}

.text {
  margin: 0 0 10px 0;
  line-height: 1.6;
  color: #e5e5e5;
}

.comment-actions {
  display: flex;
  gap: 15px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    padding: 20px;
  }

  .poster {
    width: 200px;
    margin: 0 auto;
  }

  .info {
    text-align: center;
  }

  .actions {
    justify-content: center;
  }

  .related-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style> 