<template>
  <div class="tv-container">
    <!-- 顶部筛选区域 -->
    <div class="filter-section">
      <div class="filter-header">
        <h2>
          <font-awesome-icon icon="tv" class="section-icon pulse" />
          电视剧
        </h2>
        <div class="view-toggle">
          <el-button-group>
            <el-button 
              :type="viewMode === 'grid' ? 'primary' : 'default'"
              @click="viewMode = 'grid'"
            >
              <font-awesome-icon icon="th-large" />
            </el-button>
            <el-button 
              :type="viewMode === 'list' ? 'primary' : 'default'"
              @click="viewMode = 'list'"
            >
              <font-awesome-icon icon="list" />
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 筛选标签 -->
      <div class="filter-tags">
        <div class="tag-group">
          <div class="tag-label">类型：</div>
          <div class="tags">
            <el-tag 
              v-for="tag in genreTags" 
              :key="tag.value"
              :class="{ active: currentGenre === tag.value }"
              @click="currentGenre = tag.value"
            >
              {{ tag.label }}
            </el-tag>
          </div>
        </div>
        <div class="tag-group">
          <div class="tag-label">地区：</div>
          <div class="tags">
            <el-tag 
              v-for="tag in regionTags" 
              :key="tag.value"
              :class="{ active: currentRegion === tag.value }"
              @click="currentRegion = tag.value"
            >
              {{ tag.label }}
            </el-tag>
          </div>
        </div>
        <div class="tag-group">
          <div class="tag-label">年份：</div>
          <div class="tags">
            <el-tag 
              v-for="tag in yearTags" 
              :key="tag.value"
              :class="{ active: currentYear === tag.value }"
              @click="currentYear = tag.value"
            >
              {{ tag.label }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 排序和筛选 -->
      <div class="filter-actions">
        <el-radio-group v-model="currentSort" size="large">
          <el-radio-button label="latest">最新上线</el-radio-button>
          <el-radio-button label="rating">评分最高</el-radio-button>
          <el-radio-button label="hot">最受欢迎</el-radio-button>
        </el-radio-group>
        <el-button type="primary" @click="showAdvancedFilter = true">
          <font-awesome-icon icon="filter" /> 高级筛选
        </el-button>
      </div>
    </div>

    <!-- 内容展示区域 -->
    <div class="content-section" :class="viewMode">
      <transition-group name="fade" tag="div" class="content-grid">
        <div v-for="item in displayContent" 
             :key="item.id" 
             class="content-card"
             @click="goToDetail(item)"
        >
          <div class="content-poster">
            <el-image 
              :src="item.poster" 
              :alt="item.title"
              fit="cover"
              loading="lazy"
              :preview-src-list="[item.poster]"
            >
              <template #placeholder>
                <div class="image-placeholder">
                  <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
                </div>
              </template>
              <template #error>
                <div class="image-placeholder">
                  <font-awesome-icon icon="image" />
                  <span>暂无图片</span>
                </div>
              </template>
            </el-image>
            <div class="content-overlay">
              <div class="overlay-top">
                <span class="rating">
                  <font-awesome-icon icon="star" />
                  {{ item.rating }}
                </span>
                <span class="quality" v-if="item.quality">
                  {{ item.quality }}
                </span>
              </div>
              <div class="overlay-middle">
                <p class="description">{{ item.description }}</p>
              </div>
              <div class="overlay-bottom">
                <el-button-group>
                  <el-button type="success" circle @click.stop="playVideo(item)">
                    <font-awesome-icon icon="play" />
                  </el-button>
                  <el-button type="primary" circle @click.stop="addToFavorite(item)">
                    <font-awesome-icon icon="heart" />
                  </el-button>
                  <el-button type="warning" circle @click.stop="addToWatchlist(item)">
                    <font-awesome-icon icon="clock" />
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </div>
          <div class="content-info">
            <h3>{{ item.title }}</h3>
            <div class="meta">
              <span class="year">{{ item.year }}</span>
              <span class="episodes" v-if="item.episodes">
                {{ item.episodes }}集全
              </span>
              <span class="region">{{ item.region }}</span>
            </div>
            <div class="tags">
              <el-tag 
                v-for="tag in item.tags.slice(0, 2)" 
                :key="tag" 
                size="small" 
                effect="dark"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="stats">
              <span class="views">
                <font-awesome-icon icon="eye" />
                {{ formatNumber(item.views) }}
              </span>
              <span class="likes">
                <font-awesome-icon icon="heart" />
                {{ formatNumber(item.likes) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 骨架屏加载占位 -->
        <template v-if="loading">
          <div v-for="n in 8" :key="`skeleton-${n}`" class="content-card skeleton">
            <div class="skeleton-poster">
              <el-skeleton-item variant="image" />
            </div>
            <div class="skeleton-info">
              <el-skeleton-item variant="h3" style="width: 80%" />
              <el-skeleton-item variant="text" style="width: 60%" />
              <el-skeleton-item variant="text" style="width: 40%" />
            </div>
          </div>
        </template>
      </transition-group>

      <!-- 加载更多区域 -->
      <div class="load-more" v-if="hasMore || loading">
        <el-button 
          type="primary" 
          :loading="loading" 
          @click="loadMore"
          :disabled="loading"
          size="large"
        >
          <template #loading>
            <div class="loading-text">
              <el-icon class="loading-icon"><Loading /></el-icon>
              <span>加载中...</span>
            </div>
          </template>
          <template #default>
            <span>加载更多</span>
          </template>
        </el-button>
        <p class="load-more-info" v-if="!loading">
          已加载 {{ displayContent.length }}/{{ totalItems }} 项
        </p>
      </div>

      <!-- 无更多内容提示 -->
      <div v-if="!hasMore && !loading" class="no-more">
        <el-divider>
          <font-awesome-icon icon="check-circle" />
          <span>已加载全部内容</span>
        </el-divider>
      </div>
    </div>

    <!-- 高级筛选抽屉 -->
    <el-drawer
      v-model="showAdvancedFilter"
      title="高级筛选"
      direction="rtl"
      size="380px"
      :destroy-on-close="true"
      class="filter-drawer"
    >
      <div class="drawer-content">
        <div class="filter-group">
          <h4>评分范围</h4>
          <el-slider
            v-model="filterForm.rating"
            :min="0"
            :max="10"
            :step="0.1"
            range
            show-stops
          />
        </div>
        <div class="filter-group">
          <h4>更新状态</h4>
          <el-radio-group v-model="filterForm.status">
            <el-radio label="all">全部</el-radio>
            <el-radio label="ongoing">连载中</el-radio>
            <el-radio label="finished">已完结</el-radio>
          </el-radio-group>
        </div>
        <div class="filter-group">
          <h4>排序方式</h4>
          <el-select v-model="filterForm.sort" placeholder="请选择">
            <el-option label="最新上线" value="latest" />
            <el-option label="评分最高" value="rating" />
            <el-option label="最多播放" value="views" />
            <el-option label="最多收藏" value="likes" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="primary" @click="applyFilter">应用筛选</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { tvShowsList } from '@/utils/mockData'

const router = useRouter()
const viewMode = ref('grid')
const currentGenre = ref('all')
const currentRegion = ref('all')
const currentYear = ref('all')
const currentSort = ref('latest')
const loading = ref(false)
const hasMore = ref(true)
const showAdvancedFilter = ref(false)

// 筛选表单
const filterForm = ref({
  rating: [7, 10],
  status: 'all',
  sort: 'latest'
})

// 筛选标签
const genreTags = [
  { label: '全部', value: 'all' },
  { label: '剧情', value: 'drama' },
  { label: '喜剧', value: 'comedy' },
  { label: '动作', value: 'action' },
  { label: '科幻', value: 'sci-fi' },
  { label: '悬疑', value: 'mystery' }
]

const regionTags = [
  { label: '全部', value: 'all' },
  { label: '国产剧', value: 'chinese' },
  { label: '美剧', value: 'american' },
  { label: '韩剧', value: 'korean' },
  { label: '日剧', value: 'japanese' }
]

const yearTags = [
  { label: '全部', value: 'all' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: '2022', value: '2022' },
  { label: '2021', value: '2021' }
]

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 筛选内容
const filteredContent = computed(() => {
  let result = [...tvShowsList]
  
  // 应用筛选条件
  if (currentGenre.value !== 'all') {
    result = result.filter(item => item.tags.includes(currentGenre.value))
  }
  
  if (currentRegion.value !== 'all') {
    result = result.filter(item => item.region === currentRegion.value)
  }
  
  if (currentYear.value !== 'all') {
    result = result.filter(item => item.year.toString() === currentYear.value)
  }
  
  // 应用排序
  switch (currentSort.value) {
    case 'rating':
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      break
    case 'hot':
      result.sort((a, b) => b.views - a.views)
      break
    default:
      result.sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime))
  }
  
  return result
})

// 导航方法
const goToDetail = (item) => {
  router.push({
    name: 'tvDetail',
    params: { id: item.id }
  })
}

const playVideo = (item) => {
  router.push({
    name: 'tvDetail',
    params: { id: item.id },
    query: { play: 'true' }
  })
}

const addToFavorite = (item) => {
  ElMessage.success(`已将《${item.title}》添加到收藏`)
}

const addToWatchlist = (item) => {
  ElMessage.success(`已将《${item.title}》添加到待看列表`)
}

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(12)
const totalItems = ref(0)

// 展示内容计算属性
const displayContent = computed(() => {
  const start = 0
  const end = currentPage.value * pageSize.value
  return filteredContent.value.slice(start, end)
})

// 检查是否还有更多内容
const checkHasMore = () => {
  hasMore.value = displayContent.value.length < filteredContent.value.length
  totalItems.value = filteredContent.value.length
}

// 加载更多内容
const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  
  try {
    // 模拟异步加载
    await new Promise(resolve => setTimeout(resolve, 1500))
    currentPage.value++
    checkHasMore()
    
    // 滚动到新加载内容
    if (hasMore.value) {
      await nextTick()
      const lastItem = document.querySelector('.content-grid > .content-card:last-child')
      if (lastItem) {
        lastItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  } catch (error) {
    ElMessage.error('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 监听筛选条件变化，重置分页
watch([currentGenre, currentRegion, currentYear, currentSort], () => {
  currentPage.value = 1
  checkHasMore()
}, { immediate: true })

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    rating: [7, 10],
    status: 'all',
    sort: 'latest'
  }
}

// 应用筛选
const applyFilter = () => {
  showAdvancedFilter.value = false
  ElMessage.success('筛选条件已应用')
}
</script>

<style scoped>
.tv-container {
  padding: 20px;
  animation: fadeIn 0.6s ease-out;
}

/* 筛选区域样式 */
.filter-section {
  background: linear-gradient(145deg, #2d2d2d, #333333);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #e5e5e5;
    margin: 0;
    
    .section-icon {
      color: #4CAF50;
      animation: pulse 2s infinite;
    }
  }
}

.filter-tags {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.tag-group {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .tag-label {
    color: #999;
    font-size: 14px;
    white-space: nowrap;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .el-tag {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    &.active {
      background: #4CAF50;
      color: white;
    }
  }
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .el-radio-button__inner {
    background: transparent;
    border-color: #404040;
    color: #999;
    
    &:hover {
      color: #4CAF50;
    }
  }
  
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    background: #4CAF50;
    border-color: #4CAF50;
    color: white;
  }
}

/* 内容区域样式 */
.content-section {
  &.grid .content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
  }
  
  &.list .content-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.content-card {
  background: #2d2d2d;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    
    .content-overlay {
      opacity: 1;
    }
  }
}

.content-poster {
  position: relative;
  aspect-ratio: 2/3;
  
  .el-image {
    width: 100%;
    height: 100%;
  }
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 0;
  transition: all 0.3s ease;
}

.overlay-top {
  display: flex;
  justify-content: space-between;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #F7BA2A;
  
  .fa-icon {
    animation: star 1s infinite;
  }
}

.quality {
  background: rgba(76, 175, 80, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  color: #4CAF50;
}

.overlay-middle {
  flex: 1;
  display: flex;
  align-items: center;
  
  .description {
    color: #e5e5e5;
    font-size: 14px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.overlay-bottom {
  display: flex;
  justify-content: center;
  
  .el-button {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
}

.content-info {
  padding: 16px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #e5e5e5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .meta {
    display: flex;
    gap: 12px;
    color: #999;
    font-size: 12px;
    margin-bottom: 8px;
  }
  
  .tags {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    
    .el-tag {
      background: rgba(76, 175, 80, 0.1);
      border: none;
    }
  }
  
  .stats {
    display: flex;
    justify-content: space-between;
    color: #999;
    font-size: 12px;
    
    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

/* 加载更多样式 */
.load-more {
  text-align: center;
  margin-top: 40px;
}

/* 高级筛选抽屉样式 */
:deep(.filter-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 20px;
    border-bottom: 1px solid #404040;
  }
  
  .drawer-content {
    padding: 20px;
  }
  
  .filter-group {
    margin-bottom: 24px;
    
    h4 {
      color: #e5e5e5;
      margin: 0 0 16px 0;
    }
  }
  
  .drawer-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: #2d2d2d;
    border-top: 1px solid #404040;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes star {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .filter-tags {
    .tag-group {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
  
  .filter-actions {
    flex-direction: column;
    gap: 16px;
  }
  
  .content-section.grid .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .content-section.grid .content-grid {
    grid-template-columns: 1fr;
  }
}

/* 添加骨架屏样式 */
.skeleton {
  background: #2d2d2d;
  
  .skeleton-poster {
    aspect-ratio: 2/3;
    
    .el-skeleton-item {
      width: 100%;
      height: 100%;
      background: #333333;
    }
  }
  
  .skeleton-info {
    padding: 16px;
    
    .el-skeleton-item {
      margin-bottom: 8px;
      background: #333333;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

/* 加载更多区域样式 */
.load-more {
  text-align: center;
  margin-top: 40px;
  
  .el-button {
    min-width: 160px;
    transition: all 0.3s ease;
    
    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
    }
  }
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  .loading-icon {
    animation: rotate 1s linear infinite;
  }
}

.load-more-info {
  margin-top: 12px;
  color: #999;
  font-size: 14px;
}

/* 无更多内容样式 */
.no-more {
  margin-top: 40px;
  color: #666;
  
  .el-divider {
    --el-border-color: #404040;
    
    .el-divider__text {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #999;
      
      .fa-icon {
        color: #4CAF50;
      }
    }
  }
}

/* 添加动画 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 优化过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .load-more {
    margin-top: 20px;
  }
  
  .load-more-info {
    font-size: 12px;
  }
}
</style> 