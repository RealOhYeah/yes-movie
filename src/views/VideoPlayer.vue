<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import VideoHistory from '@/components/video/VideoHistory.vue'
import Danmaku from '@/components/video/Danmaku.vue'

const route = useRoute()
const router = useRouter()
const player = ref(null)
const videoContainer = ref(null)
const isFullDescription = ref(false)
const showComments = ref(false)
const commentText = ref('')
const historyDrawer = ref(null)
const showDanmaku = ref(true)

// 模拟视频数据
const videoData = {
  id: route.params.id,
  title: '流浪地球2',
  description: '在不远的未来，太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生死之战。',
  director: '郭帆',
  actors: ['吴京', '刘德华', '李雪健', '沙溢', '宁理'],
  tags: ['科幻', '冒险', '灾难'],
  releaseDate: '2023-01-22',
  duration: '173分钟',
  rating: 4.5,
  views: '1.2亿',
  likes: '398万',
  comments: [
    {
      id: 1,
      user: '用户1',
      avatar: 'https://image.tmdb.org/t/p/w500/wojZYXQhvqVFp8QyxQzBKwVkxeX.jpg',
      content: '特效太震撼了！',
      time: '2023-12-01',
      likes: 1234
    },
    // ... 更多评论
  ]
}

const relatedVideos = [
  {
    id: 1,
    title: '满江红',
    image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
    duration: '159分钟',
    views: '8900万'
  },
  // ... 更多相关视频
]

// 播放器配置
onMounted(() => {
  const options = {
    fluid: true,
    controls: true,
    preload: 'auto',
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    controlBar: {
      children: [
        'playToggle',
        'volumePanel',
        'currentTimeDisplay',
        'timeDivider',
        'durationDisplay',
        'progressControl',
        'playbackRateMenuButton',
        'fullscreenToggle'
      ]
    },
    sources: [{
      src: 'https://vjs.zencdn.net/v/oceans.mp4',
      type: 'video/mp4'
    }]
  }

  player.value = videojs(videoContainer.value, options)
  
  // 添加播放器事件监听
  player.value.on('play', () => {
    console.log('视频开始播放')
  })

  player.value.on('pause', () => {
    console.log('视频暂停')
  })

  player.value.on('ended', () => {
    console.log('视频播放结束')
    // 可以在这里添加播放结束后的逻辑，比如自动播放下一个视频
  })
})

onUnmounted(() => {
  if (player.value) {
    player.value.dispose()
  }
})

// 切换显示完整描述
const toggleDescription = () => {
  isFullDescription.value = !isFullDescription.value
}

// 提交评论
const submitComment = () => {
  if (!commentText.value.trim()) return
  
  // 这里可以添加提交评论的逻辑
  videoData.comments.unshift({
    id: Date.now(),
    user: '当前用户',
    avatar: 'https://image.tmdb.org/t/p/w500/wojZYXQhvqVFp8QyxQzBKwVkxeX.jpg',
    content: commentText.value,
    time: new Date().toLocaleDateString(),
    likes: 0
  })
  
  commentText.value = ''
}

// 跳转到相关视频
const goToRelatedVideo = (videoId) => {
  router.push({
    name: 'video',
    params: { id: videoId }
  })
}

const toggleDanmaku = () => {
  showDanmaku.value = !showDanmaku.value
}
</script>

<template>
  <div class="video-player-page">
    <!-- 视频播放器区域 -->
    <div class="player-section">
      <video
        ref="videoContainer"
        class="video-js vjs-big-play-centered vjs-theme-custom"
      />
    </div>

    <!-- 视频信息区域 -->
    <div class="video-info-section">
      <div class="video-primary-info">
        <h1>{{ videoData.title }}</h1>
        <div class="video-stats">
          <el-rate v-model="videoData.rating" disabled show-score />
          <span class="views">
            <font-awesome-icon icon="eye" /> {{ videoData.views }}次观看
          </span>
          <span class="likes">
            <font-awesome-icon icon="thumbs-up" /> {{ videoData.likes }}
          </span>
          <span class="release-date">上映日期：{{ videoData.releaseDate }}</span>
          <span class="duration">片长：{{ videoData.duration }}</span>
        </div>
        <div class="action-buttons">
          <el-button type="success" icon="Plus">收藏</el-button>
          <el-button type="primary" icon="Share">分享</el-button>
          <el-button icon="Flag">举报</el-button>
        </div>
        <div class="video-tags">
          <el-tag 
            v-for="tag in videoData.tags" 
            :key="tag"
            class="tag"
            type="success"
            effect="dark"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <el-divider />

      <div class="video-details">
        <h3>简介</h3>
        <p :class="{ 'description-full': isFullDescription }">
          {{ videoData.description }}
        </p>
        <el-button 
          text 
          type="primary" 
          @click="toggleDescription"
        >
          {{ isFullDescription ? '收起' : '展开' }}
        </el-button>
        
        <div class="cast-info">
          <div class="info-item">
            <span class="label">导演：</span>
            <span>{{ videoData.director }}</span>
          </div>
          <div class="info-item">
            <span class="label">主演：</span>
            <span>{{ videoData.actors.join('、') }}</span>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 评论区域 -->
      <div class="comments-section">
        <div class="comments-header">
          <h3>评论区</h3>
          <el-button 
            type="primary" 
            @click="showComments = !showComments"
          >
            {{ showComments ? '收起评论' : '查看评论' }}
          </el-button>
        </div>

        <div v-show="showComments" class="comments-content">
          <div class="comment-input">
            <el-input
              v-model="commentText"
              type="textarea"
              :rows="3"
              placeholder="发表你的评论..."
            />
            <el-button 
              type="primary" 
              @click="submitComment"
              :disabled="!commentText.trim()"
            >
              发表评论
            </el-button>
          </div>

          <div class="comments-list">
            <div 
              v-for="comment in videoData.comments" 
              :key="comment.id"
              class="comment-item"
            >
              <img :src="comment.avatar" :alt="comment.user" class="comment-avatar">
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-user">{{ comment.user }}</span>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
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
      </div>

      <el-divider />

      <!-- 相关推荐 -->
      <div class="related-videos">
        <h3>相关推荐</h3>
        <div class="video-grid">
          <div 
            v-for="video in relatedVideos" 
            :key="video.id"
            class="related-video-card"
            @click="goToRelatedVideo(video.id)"
          >
            <div class="video-thumbnail">
              <img :src="video.image" :alt="video.title">
              <div class="video-info-overlay">
                <span class="duration">{{ video.duration }}</span>
                <span class="views">{{ video.views }}次观看</span>
              </div>
            </div>
            <h4>{{ video.title }}</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="player-controls">
      <VideoHistory ref="historyDrawer" />
      <Danmaku />
      <el-button-group>
        <el-button 
          type="primary"
          @click="historyDrawer.show()"
        >
          播放历史
        </el-button>
        <el-button 
          type="primary"
          @click="toggleDanmaku"
        >
          {{ showDanmaku ? '关闭弹幕' : '开启弹幕' }}
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<style scoped>
.video-player-page {
  padding: 20px;
  color: #e5e5e5;
}

.player-section {
  margin-bottom: 20px;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-info-section {
  background-color: #2d2d2d;
  border-radius: 8px;
  padding: 20px;
}

.video-primary-info h1 {
  margin: 0 0 16px 0;
  font-size: 24px;
}

.video-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.video-tags {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  border-radius: 4px;
}

.video-details {
  margin: 20px 0;
}

.video-details h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
}

.video-details p {
  color: #b3b3b3;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.cast-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.label {
  color: #999;
}

.related-videos {
  margin-top: 20px;
}

.related-videos h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.related-video-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.related-video-card:hover {
  transform: translateY(-4px);
}

.video-thumbnail {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
}

.related-video-card h4 {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #e5e5e5;
}

/* VideoJS 自定义样式 */
:deep(.video-js) {
  width: 100%;
  aspect-ratio: 16/9;
}

:deep(.vjs-big-play-button) {
  background-color: rgba(76, 175, 80, 0.8) !important;
  border-color: #4CAF50 !important;
}

:deep(.vjs-control-bar) {
  background-color: rgba(45, 45, 45, 0.9) !important;
}

:deep(.vjs-play-progress) {
  background-color: #4CAF50 !important;
}

.description-full {
  max-height: none !important;
}

.action-buttons {
  margin: 16px 0;
  display: flex;
  gap: 12px;
}

.comments-section {
  margin: 20px 0;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comment-input {
  margin-bottom: 20px;
}

.comment-input .el-button {
  margin-top: 12px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 16px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: bold;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-text {
  margin: 0;
  line-height: 1.5;
}

.comment-actions {
  margin-top: 8px;
  display: flex;
  gap: 12px;
}

.video-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 12px;
}

/* VideoJS 主题自定义 */
:deep(.vjs-theme-custom) {
  --vjs-theme-primary: #4CAF50;
}

:deep(.vjs-theme-custom .vjs-big-play-button) {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  line-height: 80px;
  font-size: 40px;
}

:deep(.vjs-theme-custom .vjs-control-bar) {
  height: 4em;
}
</style> 