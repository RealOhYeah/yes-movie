<template>
  <div class="tv-container">
    <!-- 顶部筛选区域 -->
    <div class="filter-section">
      <div class="filter-header">
        <div class="header-left">
          <h2>
            <font-awesome-icon icon="tv" class="section-icon pulse" />
            电视剧
          </h2>
          <div class="quick-filters">
            <el-tag 
              v-for="tag in quickFilterTags" 
              :key="tag.value"
              :class="{ active: currentQuickFilter === tag.value }"
              @click="currentQuickFilter = tag.value"
            >
              <font-awesome-icon :icon="tag.icon" />
              {{ tag.label }}
            </el-tag>
          </div>
        </div>
        <div class="view-toggle">
          <el-button-group>
            <el-tooltip content="网格视图" placement="top">
              <el-button 
                :type="viewMode === 'grid' ? 'primary' : 'default'"
                @click="viewMode = 'grid'"
              >
                <font-awesome-icon icon="th-large" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="列表视图" placement="top">
              <el-button 
                :type="viewMode === 'list' ? 'primary' : 'default'"
                @click="viewMode = 'list'"
              >
                <font-awesome-icon icon="list" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>

      <!-- 筛选标签 -->
      <div class="filter-tags">
        <div class="tag-group">
          <div class="tag-label">
            <font-awesome-icon icon="tags" />
            类型：
          </div>
          <div class="tags">
            <el-tag 
              v-for="tag in genreTags" 
              :key="tag.value"
              :class="{ active: currentGenre === tag.value }"
              @click="currentGenre = tag.value"
            >
              {{ tag.label }}
              <span class="tag-count" v-if="tag.count">({{ tag.count }})</span>
            </el-tag>
          </div>
        </div>
        <div class="tag-group">
          <div class="tag-label">
            <font-awesome-icon icon="globe" />
            地区：
          </div>
          <div class="tags">
            <el-tag 
              v-for="tag in regionTags" 
              :key="tag.value"
              :class="{ active: currentRegion === tag.value }"
              @click="currentRegion = tag.value"
            >
              {{ tag.label }}
              <span class="tag-count" v-if="tag.count">({{ tag.count }})</span>
            </el-tag>
          </div>
        </div>
        <div class="tag-group">
          <div class="tag-label">
            <font-awesome-icon icon="calendar" />
            年份：
          </div>
          <div class="tags">
            <el-tag 
              v-for="tag in yearTags" 
              :key="tag.value"
              :class="{ active: currentYear === tag.value }"
              @click="currentYear = tag.value"
            >
              {{ tag.label }}
              <span class="tag-count" v-if="tag.count">({{ tag.count }})</span>
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 排序和筛选 -->
      <div class="filter-actions">
        <div class="sort-options">
          <el-radio-group v-model="currentSort" size="large">
            <el-radio-button label="latest">
              <font-awesome-icon icon="clock" />
              最新上线
            </el-radio-button>
            <el-radio-button label="rating">
              <font-awesome-icon icon="star" />
              评分最高
            </el-radio-button>
            <el-radio-button label="hot">
              <font-awesome-icon icon="fire" />
              最受欢迎
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="advanced-filter">
          <el-button type="primary" @click="showAdvancedFilter = true">
            <font-awesome-icon icon="sliders" class="filter-icon" />
            高级筛选
            <el-badge 
              :value="activeFilterCount" 
              :hidden="activeFilterCount === 0"
              class="filter-badge"
            />
          </el-button>
        </div>
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
    style="background-color: #1a1a1a;"
      v-model="showAdvancedFilter"
      title="高级筛选"
      direction="rtl"
      size="380px"
      :destroy-on-close="true"
      class="filter-drawer"
    >
      <template #header>
        <div class="drawer-header">
          <h3>
            <font-awesome-icon icon="sliders" class="header-icon" />
            高级筛选
            <el-tag v-if="activeFilterCount > 0" size="small" type="success" class="filter-count">
              {{ activeFilterCount }}
            </el-tag>
          </h3>
          <el-button link @click="resetFilter" :disabled="!hasActiveFilters">
            <font-awesome-icon icon="rotate-left" class="reset-icon" />
            重置
          </el-button>
        </div>
      </template>
      
      <div class="drawer-content">
        <!-- 评分范围 -->
        <div class="filter-group">
          <h4>
            <font-awesome-icon icon="star" class="group-icon" />
            评分范围
          </h4>
          <div class="rating-slider">
            <el-slider
              v-model="filterForm.rating"
              :min="0"
              :max="10"
              :step="0.1"
              range
              :marks="{
                0: '0',
                2: '2',
                4: '4',
                6: '6',
                8: '8',
                10: '10'
              }"
            >
              <template #marker="{ value }">
                <div class="rating-marker">
                  <font-awesome-icon icon="star" class="marker-icon" />
                  <span>{{ value }}</span>
                </div>
              </template>
            </el-slider>
            <div class="rating-range">
              <span>{{ filterForm.rating[0] }}分</span>
              <span>{{ filterForm.rating[1] }}分</span>
            </div>
          </div>
        </div>

        <!-- 更新状态 -->
        <div class="filter-group">
          <h4>
            <font-awesome-icon icon="clock" class="group-icon" />
            更新状态
          </h4>
          <div class="status-options">
            <el-radio-group v-model="filterForm.status" class="status-group">
              <el-radio label="all">
                <div class="radio-content">
                  <font-awesome-icon icon="list" />
                  <span>全部</span>
                </div>
              </el-radio>
              <el-radio label="ongoing">
                <div class="radio-content">
                  <font-awesome-icon icon="play" />
                  <span>连载中</span>
                  <el-tag size="small" type="success" effect="dark">更新中</el-tag>
                </div>
              </el-radio>
              <el-radio label="finished">
                <div class="radio-content">
                  <font-awesome-icon icon="check" />
                  <span>已完结</span>
                </div>
              </el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 更新频率 -->
        <div class="filter-group">
          <h4>
            <font-awesome-icon icon="calendar" class="group-icon" />
            更新频率
          </h4>
          <div class="update-options">
            <el-select v-model="filterForm.updateFreq" placeholder="选择更新频率" class="freq-select">
              <el-option label="每日更新" value="daily">
                <div class="option-content">
                  <font-awesome-icon icon="calendar-day" />
                  <span>每日更新</span>
                  <el-tag size="small" type="danger" effect="dark">热门</el-tag>
                </div>
              </el-option>
              <el-option label="每周更新" value="weekly">
                <div class="option-content">
                  <font-awesome-icon icon="calendar-week" />
                  <span>每周更新</span>
                </div>
              </el-option>
              <el-option label="月度更新" value="monthly">
                <div class="option-content">
                  <font-awesome-icon icon="calendar-alt" />
                  <span>月度更新</span>
                </div>
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- 清晰度 -->
        <div class="filter-group">
          <h4>
            <font-awesome-icon icon="tv" class="group-icon" />
            清晰度
          </h4>
          <div class="quality-options">
            <el-checkbox-group v-model="filterForm.quality" class="quality-group">
              <el-checkbox label="4K">
                <div class="checkbox-content">
                  <font-awesome-icon icon="crown" />
                  <span>4K超清</span>
                  <el-tag size="small" type="warning" effect="dark">VIP</el-tag>
                </div>
              </el-checkbox>
              <el-checkbox label="1080P">
                <div class="checkbox-content">
                  <font-awesome-icon icon="film" />
                  <span>1080P高清</span>
                </div>
              </el-checkbox>
              <el-checkbox label="720P">
                <div class="checkbox-content">
                  <font-awesome-icon icon="video" />
                  <span>720P标清</span>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="showAdvancedFilter = false">
            <font-awesome-icon icon="times" />
            取消
          </el-button>
          <el-button type="primary" @click="applyFilter" :disabled="!hasActiveFilters">
            <font-awesome-icon icon="check" />
            应用筛选
          </el-button>
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
  animation: slideDown 0.6s ease-out;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #e5e5e5;
    margin: 0;
    font-size: 24px;
    
    .section-icon {
      color: #4CAF50;
      animation: pulse 2s infinite;
    }
  }
}

.quick-filters {
  display: flex;
  gap: 12px;
  
  .el-tag {
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    border-color: #404040;
    
    .fa-icon {
      margin-right: 6px;
    }
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(76, 175, 80, 0.1);
      border-color: #4CAF50;
    }
    
    &.active {
      background: #4CAF50;
      border-color: #4CAF50;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }
  }
}

.view-toggle {
  .el-button-group {
    .el-button {
      padding: 8px 16px;
      
      &:not(.el-button--primary) {
        background: transparent;
        border-color: #404040;
        color: #999;
        
        &:hover {
          color: #4CAF50;
          border-color: #4CAF50;
        }
      }
      
      &.el-button--primary {
        background: #4CAF50;
        border-color: #4CAF50;
        
        &:hover {
          background: #45a049;
          transform: translateY(-2px);
        }
      }
    }
  }
}

.filter-tags {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.tag-group {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .tag-label {
    color: #999;
    font-size: 14px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 80px;
    
    .fa-icon {
      color: #4CAF50;
    }
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .el-tag {
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    border-color: #404040;
    
    .tag-count {
      margin-left: 4px;
      opacity: 0.7;
      font-size: 12px;
    }
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(76, 175, 80, 0.1);
      border-color: #4CAF50;
    }
    
    &.active {
      background: #4CAF50;
      border-color: #4CAF50;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }
  }
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sort-options {
  .el-radio-button__inner {
    background: transparent;
    border-color: #404040;
    color: #999;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .fa-icon {
      font-size: 14px;
    }
    
    &:hover {
      color: #4CAF50;
    }
  }
  
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    background: #4CAF50;
    border-color: #4CAF50;
    color: white;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
}

.advanced-filter {
  .el-button {
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .filter-icon {
      transition: transform 0.3s ease;
    }
    
    &:hover {
      .filter-icon {
        transform: rotate(90deg);
      }
    }
  }
  
  .filter-badge {
    margin-left: 4px;
  }
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
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

/* 响应式适配 */
@media (max-width: 768px) {
  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-actions {
    flex-direction: column;
    gap: 16px;
  }
  
  .sort-options {
    width: 100%;
    
    .el-radio-group {
      display: flex;
      width: 100%;
      
      .el-radio-button {
        flex: 1;
        
        .el-radio-button__inner {
          width: 100%;
          justify-content: center;
        }
      }
    }
  }
  
  .advanced-filter {
    width: 100%;
    
    .el-button {
      width: 100%;
      justify-content: center;
    }
  }
}

/* 内容区域基础样式 */
.content-section {
  margin-top: 30px;
  
  &.grid .content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
    padding: 10px;
  }
  
  &.list .content-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

/* 内容卡片样式 */
.content-card {
  background: #2d2d2d;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    
    .content-overlay {
      opacity: 1;
      backdrop-filter: blur(4px);
    }
    
    .content-info h3 {
      color: #4CAF50;
    }
  }
}

/* 海报样式 */
.content-poster {
  position: relative;
  aspect-ratio: 2/3;
  
  .el-image {
    width: 100%;
    height: 100%;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

/* 遮罩层样式 */
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
  align-items: center;
}

.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(247, 186, 42, 0.2);
  border-radius: 4px;
  backdrop-filter: blur(4px);
  
  .fa-icon {
    color: #F7BA2A;
    animation: star 1s infinite;
  }
}

.quality {
  background: rgba(76, 175, 80, 0.2);
  padding: 4px 8px;
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
  gap: 8px;
  
  .el-button {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
}

/* 内容信息样式 */
.content-info {
  padding: 16px;
  
  h3 {
    font-size: 16px;
    color: #e5e5e5;
    margin: 0 0 8px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.3s ease;
  }
  
  .meta {
    display: flex;
    gap: 12px;
    color: #999;
    font-size: 12px;
    margin-bottom: 8px;
    flex-wrap: wrap;
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

/* 骨架屏样式 */
.skeleton {
  .skeleton-poster {
    aspect-ratio: 2/3;
    background: #333333;
    
    .el-skeleton-item {
      width: 100%;
      height: 100%;
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
    height: 44px;
    font-size: 16px;
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
}

.load-more-info {
  margin-top: 12px;
  color: #999;
  font-size: 14px;
}

/* 无更多内容提示 */
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

/* 响应式适配 */
@media (max-width: 1200px) {
  .content-section.grid .content-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .content-section.grid .content-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
  
  .content-info {
    padding: 12px;
    
    h3 {
      font-size: 14px;
    }
  }
  
  .overlay-bottom .el-button {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .content-section.grid .content-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .content-overlay {
    padding: 12px;
  }
  
  .overlay-middle .description {
    -webkit-line-clamp: 2;
    font-size: 12px;
  }
}

/* 高级筛选抽屉样式 */
:deep(.filter-drawer) {
  .el-drawer {
    background: #1a1a1a;
    border-left: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(180deg, rgba(76, 175, 80, 0.05), transparent);
      pointer-events: none;
    }
  }
  
  .drawer-header {
    margin-bottom: 0;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: #2d2d2d;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #e5e5e5;
      font-size: 18px;
      font-weight: 500;
      
      .header-icon {
        color: #4CAF50;
        animation: spin 2s linear infinite;
      }
      
      .filter-count {
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        background: linear-gradient(45deg, #4CAF50, #45a049);
      }
    }
    
    .reset-icon {
      transition: transform 0.3s ease;
    }
    
    .el-button:not(:disabled):hover .reset-icon {
      transform: rotate(-180deg);
    }
  }
  
  .drawer-content {
    padding: 24px;
    background: #1a1a1a;
  }
  
  .filter-group {
    margin-bottom: 32px;
    
    h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #e5e5e5;
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 500;
      
      .group-icon {
        color: #4CAF50;
      }
    }
  }
  
  /* 评分滑块样式 */
  .rating-slider {
    padding: 0 12px;
    
    .el-slider {
      --el-slider-main-bg-color: #4CAF50;
      --el-slider-runway-bg-color: rgba(255, 255, 255, 0.1);
      --el-slider-stop-bg-color: #666;
      
      .el-slider__runway {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      .el-slider__bar {
        background: linear-gradient(90deg, #4CAF50, #45a049);
      }
      
      .el-slider__button {
        border: none;
        background: linear-gradient(145deg, #4CAF50, #45a049);
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        
        &:hover {
          transform: scale(1.2);
        }
      }
    }
    
    .rating-range {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      color: #999;
      font-size: 14px;
    }
  }
  
  /* 状态选项样式 */
  .status-options {
    .status-group {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 12px;
      
      .el-radio {
        margin-right: 0;
        padding: 16px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        transition: all 0.3s ease;
        
        .radio-content {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #999;
          
          .fa-icon {
            font-size: 16px;
            width: 20px;
          }
          
          span {
            flex: 1;
            white-space: nowrap;
          }
          
          .el-tag {
            margin-left: auto;
            font-size: 12px;
            padding: 0 8px;
            height: 24px;
            line-height: 24px;
          }
        }
        
        &:hover {
          background: rgba(76, 175, 80, 0.1);
          transform: translateY(-2px);
        }
        
        .el-radio__input.is-checked + .el-radio__label {
          color: #4CAF50;
        }
      }
    }
  }
  
  /* 更新频率选择器样式 */
  .freq-select {
    width: 100%;
    
    :deep(.el-input__wrapper) {
      background-color: rgba(255, 255, 255, 0.05);
      box-shadow: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
      
      &:hover {
        border-color: #4CAF50;
      }
      
      &.is-focus {
        border-color: #4CAF50;
        box-shadow: 0 0 0 1px #4CAF50;
      }
    }
  }
  
  /* 清晰度选项样式 */
  .quality-group {
    display: grid;
    gap: 12px;
    
    .el-checkbox {
      margin-right: 0;
      padding: 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      
      .checkbox-content {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #999;
        
        .fa-icon {
          color: #4CAF50;
        }
        
        .el-tag {
          margin-left: auto;
        }
      }
      
      &:hover {
        background: rgba(76, 175, 80, 0.1);
        transform: translateY(-2px);
      }
      
      &.is-checked {
        .checkbox-content {
          color: #4CAF50;
        }
      }
    }
  }
  
  /* 抽屉底部样式 */
  .drawer-footer {
    padding: 20px;
    background: #2d2d2d;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .el-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      transition: all 0.3s ease;
      
      &:not(.el-button--primary) {
        background: transparent;
        border-color: #404040;
        color: #b3b3b3;
        
        &:hover {
          border-color: #4CAF50;
          color: #4CAF50;
        }
      }
      
      &.el-button--primary {
        background: linear-gradient(145deg, #4CAF50, #45a049);
        border: none;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}

/* 动画效果 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式适配 */
@media (max-width: 768px) {
  :deep(.filter-drawer) {
    .status-options .status-group {
      grid-template-columns: 1fr;
    }
  }
}

/* 更新状态徽章样式 */
.update-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap; /* 防止文字换行 */
  max-width: 80px; /* 限制最大宽度 */
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  
  &.updating {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  }
  
  &.finished {
    background: linear-gradient(45deg, #909399, #808285);
    box-shadow: 0 2px 8px rgba(144, 147, 153, 0.3);
  }
}

/* 调整卡片内容布局 */
.content-info {
  padding: 16px;
  
  .meta {
    display: flex;
    gap: 12px;
    color: #999;
    font-size: 12px;
    margin-bottom: 8px;
    flex-wrap: wrap; /* 允许内容换行 */
  }
}
</style> 