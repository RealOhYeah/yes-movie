<template>
  <div class="home-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <!-- 搜索框主体 -->
        <el-input
          v-model="searchQuery"
          placeholder="搜索你感兴趣的影视剧..."
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
          @focus="showSearchPanel = true"
          @blur="handleSearchBlur"
        >
          <template #prefix>
            <font-awesome-icon icon="search" class="search-icon" />
          </template>
          <template #append>
            <el-dropdown trigger="click" @command="handleAdvancedSearch">
              <el-button type="primary" class="advanced-search-btn">
                高级搜索 <font-awesome-icon icon="angle-down" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu class="advanced-search-menu">
                  <el-dropdown-item command="type">
                    <div class="dropdown-item-content">
                      <font-awesome-icon icon="film" />
                      <span>按类型搜索</span>
                      <font-awesome-icon icon="chevron-right" class="arrow-icon" />
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="region">
                    <div class="dropdown-item-content">
                      <font-awesome-icon icon="globe" />
                      <span>按地区搜索</span>
                      <font-awesome-icon icon="chevron-right" class="arrow-icon" />
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="year">
                    <div class="dropdown-item-content">
                      <font-awesome-icon icon="calendar" />
                      <span>按年份搜索</span>
                      <font-awesome-icon icon="chevron-right" class="arrow-icon" />
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="rating">
                    <div class="dropdown-item-content">
                      <font-awesome-icon icon="star" />
                      <span>按评分搜索</span>
                      <font-awesome-icon icon="chevron-right" class="arrow-icon" />
                    </div>
                  </el-dropdown-item>
                  <el-divider class="dropdown-divider" />
                  <el-dropdown-item command="custom">
                    <div class="dropdown-item-content highlight">
                      <font-awesome-icon icon="sliders" />
                      <span>自定义筛选</span>
                      <font-awesome-icon icon="chevron-right" class="arrow-icon" />
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-input>
        
        <!-- 搜索建议面板 -->
        <div v-show="showSearchPanel && searchQuery" class="search-suggestions">
          <div class="suggestion-header">
            <span>搜索建议</span>
            <el-button link @click="showSearchPanel = false">
              关闭 <font-awesome-icon icon="times" />
            </el-button>
          </div>
          <div class="suggestion-content">
            <template v-if="searchSuggestions.length">
              <div
                v-for="item in searchSuggestions"
                :key="item.id"
                class="suggestion-item"
                @click="handleSuggestionClick(item)"
              >
                <div class="suggestion-thumb">
                  <el-image :src="item.poster" :alt="item.title">
                    <template #error>
                      <div class="image-placeholder">
                        <font-awesome-icon icon="image" />
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="suggestion-info">
                  <h4>{{ item.title }}</h4>
                  <div class="suggestion-meta">
                    <span class="year">{{ item.year }}</span>
                    <span class="rating">
                      <font-awesome-icon icon="star" /> {{ item.rating }}
                    </span>
                  </div>
                  <div class="suggestion-tags">
                    <el-tag v-for="tag in item.tags.slice(0, 2)" 
                           :key="tag" 
                           size="small" 
                           effect="dark">
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="no-suggestions">
              <font-awesome-icon icon="search" />
              <p>未找到相关内容</p>
            </div>
          </div>
        </div>
        
        <!-- 热门搜索标签 -->
        <div class="hot-searches" v-show="!showSearchPanel">
          <span class="hot-label">
            <font-awesome-icon icon="fire" class="hot-icon" /> 热门搜索：
          </span>
          <div class="hot-tags">
            <el-tag
              v-for="tag in hotSearches"
              :key="tag"
              size="small"
              effect="plain"
              @click="quickSearch(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 顶部轮播图区域 -->
    <div class="banner-section">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="item in bannerItems" :key="item.id">
          <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="banner-content">
              <div class="banner-info">
                <h2>{{ item.title }}</h2>
                <div class="banner-meta">
                  <span class="rating">
                    <font-awesome-icon icon="star" /> {{ item.rating }}
                  </span>
                  <span class="year">{{ item.year }}</span>
                  <span class="category">{{ item.category }}</span>
                </div>
                <p class="description">{{ item.description }}</p>
                <div class="banner-tags">
                  <el-tag v-for="tag in item.tags" :key="tag" size="small" effect="dark">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              <div class="banner-actions">
                <el-button-group>
                  <el-button type="success" size="large" @click="watchNow(item)">
                    <font-awesome-icon icon="play" /> 立即观看
                  </el-button>
                  <el-button type="primary" size="large" @click="addToFavorite(item)">
                    <font-awesome-icon icon="heart" /> 收藏
                  </el-button>
                  <el-button type="warning" size="large" @click="addToWatchlist(item)">
                    <font-awesome-icon icon="clock" /> 待看
                  </el-button>
                </el-button-group>
                <el-button type="info" circle @click="showInfo(item)">
                  <font-awesome-icon icon="info" />
                </el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 热门推荐区域 -->
    <div class="trending-section">
      <div class="section-header">
        <div class="header-left">
          <h2>热门推荐</h2>
          <div class="filter-tags">
            <el-tag 
              v-for="tag in filterTags" 
              :key="tag.value"
              :class="{ active: currentTag === tag.value }"
              @click="currentTag = tag.value"
            >
              {{ tag.label }}
            </el-tag>
          </div>
        </div>
        <div class="filter-buttons">
          <el-radio-group v-model="currentFilter" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="newest">最新</el-radio-button>
            <el-radio-button label="rating">好评</el-radio-button>
            <el-radio-button label="hot">热门</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="content-grid">
        <div v-for="item in filteredContent" :key="item.id" 
             class="content-card" @click="goToDetail(item)">
          <div class="content-poster">
            <el-image 
              :src="item.poster" 
              :alt="item.title"
              @error="handleImageError"
              @loading="handleImageLoading"
            >
              <template #loading>
                <div class="image-loading">
                  <el-skeleton-item variant="image" style="width: 100%; height: 100%">
                    <div class="loading-animation">
                      <font-awesome-icon icon="spinner" spin />
                    </div>
                  </el-skeleton-item>
                </div>
              </template>
              <template #error>
                <div class="image-placeholder">
                  <font-awesome-icon icon="image" size="2x" />
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
              <div class="overlay-bottom">
                <el-button-group>
                  <el-button type="success" circle @click.stop="playVideo(item)">
                    <font-awesome-icon icon="play" />
                  </el-button>
                  <el-button type="primary" circle @click.stop="addToFavorite(item)">
                    <font-awesome-icon icon="heart" />
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </div>
          <div class="content-info">
            <h3>{{ item.title }}</h3>
            <div class="meta">
              <span class="year">{{ item.year }}</span>
              <span class="episodes" v-if="item.episodes">{{ item.episodes }}集</span>
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
            <div class="popularity">
              <div class="views">
                <font-awesome-icon icon="eye" />
                {{ formatNumber(item.views) }}
              </div>
              <div class="likes">
                <font-awesome-icon icon="heart" />
                {{ formatNumber(item.likes) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新上线区域 -->
    <div class="latest-section">
      <div class="section-header">
        <div class="header-left">
          <h2>最新上线</h2>
          <div class="category-tags">
            <el-tag 
              v-for="category in categories" 
              :key="category.value"
              :class="{ active: currentCategory === category.value }"
              @click="currentCategory = category.value"
            >
              {{ category.label }}
            </el-tag>
          </div>
        </div>
        <div class="filter-buttons">
          <el-radio-group v-model="latestFilter" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="today">今日更新</el-radio-button>
            <el-radio-button label="week">本周热门</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <div class="content-grid">
        <div v-for="item in filteredLatestItems" 
             :key="item.id" 
             class="content-card" 
             @click="goToDetail(item)">
          <div class="content-poster">
            <el-image 
              :src="item.poster" 
              :alt="item.title"
              @error="handleImageError"
              @loading="handleImageLoading"
            >
              <template #loading>
                <div class="image-loading">
                  <el-skeleton-item variant="image" style="width: 100%; height: 100%">
                    <div class="loading-animation">
                      <font-awesome-icon icon="spinner" spin />
                    </div>
                  </el-skeleton-item>
                </div>
              </template>
              <template #error>
                <div class="image-placeholder">
                  <font-awesome-icon icon="image" size="2x" />
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
                <span class="update-badge" :class="item.status">
                  {{ item.status === 'updating' ? '更新中' : '已完结' }}
                </span>
              </div>
              <div class="overlay-bottom">
                <el-button-group>
                  <el-button type="success" circle @click.stop="playVideo(item)">
                    <font-awesome-icon icon="play" />
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
              <span class="update-time">{{ formatTime(item.updateTime) }}</span>
              <span v-if="item.currentEpisode" class="episodes">
                更新至{{ item.currentEpisode }}集
              </span>
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
          </div>
        </div>
      </div>
    </div>

    <!-- 添加高级搜索抽屉 -->
    <el-drawer
      v-model="showAdvancedDrawer"
      :title="advancedSearchTitle"
      direction="rtl"
      size="380px"
      :destroy-on-close="true"
      class="advanced-search-drawer"
    >
      <template #header>
        <div class="drawer-header">
          <h3>{{ advancedSearchTitle }}</h3>
          <el-button link @click="resetAdvancedSearch">
            <font-awesome-icon icon="rotate-left" /> 重置
          </el-button>
        </div>
      </template>
      
      <div class="drawer-content">
        <!-- 类型筛选 -->
        <template v-if="currentSearchType === 'type'">
          <div class="filter-section">
            <h4>影视类型</h4>
            <div class="filter-tags">
              <el-check-tag
                v-for="type in videoTypes"
                :key="type"
                :checked="selectedTypes.includes(type)"
                @change="toggleType(type)"
              >
                {{ type }}
              </el-check-tag>
            </div>
          </div>
        </template>

        <!-- 地区筛选 -->
        <template v-if="currentSearchType === 'region'">
          <div class="filter-section">
            <h4>制片地区</h4>
            <el-radio-group v-model="selectedRegion" class="region-group">
              <el-radio-button v-for="region in regions" 
                              :key="region.value" 
                              :label="region.value">
                {{ region.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </template>

        <!-- 年份筛选 -->
        <template v-if="currentSearchType === 'year'">
          <div class="filter-section">
            <h4>上映年份</h4>
            <el-date-picker
              v-model="selectedYear"
              type="year"
              placeholder="选择年份"
              :clearable="false"
              class="year-picker"
            />
          </div>
        </template>

        <!-- 评分筛选 -->
        <template v-if="currentSearchType === 'rating'">
          <div class="filter-section">
            <h4>最低评分</h4>
            <div class="rating-slider">
              <el-slider
                v-model="selectedRating"
                :min="0"
                :max="10"
                :step="0.1"
                show-input
              />
            </div>
          </div>
        </template>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="showAdvancedDrawer = false">取消</el-button>
          <el-button type="primary" @click="applyAdvancedSearch">
            应用筛选
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { bannerItems, tvShowsList, defaultImage } from '@/utils/mockData'

const router = useRouter()
const currentTag = ref('all')
const currentCategory = ref('all')
const currentFilter = ref('all')
const viewMode = ref('grid')
const latestFilter = ref('all')
const searchQuery = ref('')
const hotSearches = [
  '奥本海默',
  '三体',
  '长安三万里',
  '狂飙',
  '黑暗荣耀'
]

// 筛选标签
const filterTags = [
  { label: '全部', value: 'all' },
  { label: '国产剧', value: 'chinese' },
  { label: '韩剧', value: 'korean' },
  { label: '美剧', value: 'american' },
  { label: '日剧', value: 'japanese' }
]

// 分类
const categories = [
  { label: '全部', value: 'all' },
  { label: '连载', value: 'updating' },
  { label: '完结', value: 'finished' },
  { label: '预告', value: 'upcoming' }
]

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  // 如果是今天
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    if (hours < 1) {
      return '刚刚'
    }
    return `${hours}小时前`
  }
  
  // 如果是昨天
  if (diff < 48 * 60 * 60 * 1000) {
    return '昨天'
  }
  
  // 如果是最近7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }
  
  // 其他情况显示具体日期
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 筛选内容
const filteredContent = computed(() => {
  let result = [...tvShowsList]
  
  if (currentTag.value !== 'all') {
    result = result.filter(item => item.region === currentTag.value)
  }
  
  switch (currentFilter.value) {
    case 'newest':
      result.sort((a, b) => b.year - a.year)
      break
    case 'rating':
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      break
    case 'hot':
      result.sort((a, b) => b.views - a.views)
      break
  }
  
  return result
})

// 筛选最新上线内容
const filteredLatestItems = computed(() => {
  let result = [...tvShowsList]
  
  // 按更新时间排序
  result.sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime))
  
  if (currentCategory.value !== 'all') {
    result = result.filter(item => {
      if (currentCategory.value === 'updating') {
        return item.episodes !== null
      } else if (currentCategory.value === 'finished') {
        return item.episodes === null
      }
      return true
    })
  }
  
  return result.map(item => ({
    ...item,
    currentEpisode: item.episodes ? Math.min(Math.floor(Math.random() * item.episodes) + 1, item.episodes) : null,
    status: item.episodes ? 'updating' : 'finished'
  }))
})

// 导航方法
const goToDetail = (item) => {
  router.push({
    name: 'tvDetail',
    params: { id: item.id }
  })
}

const watchNow = (item) => {
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
  ElMessage.success('已添加到收藏')
}

const addToWatchlist = (item) => {
  ElMessage.success('已添加到待看列表')
}

const changeView = (mode) => {
  viewMode.value = mode
}

// 添加图片错误处理
const handleImageError = (e) => {
  e.target.src = defaultImage
}

// 添加图加载状态处理
const handleImageLoading = (e) => {
  e.target.src = defaultImage
}

const quickSearch = (tag) => {
  searchQuery.value = tag
  handleSearch()
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage({
      message: '请输入搜索内容',
      type: 'warning'
    })
    return
  }
  ElMessage.success(`正在搜索: ${searchQuery.value}`)
}

// 添加新的响应式变量
const showSearchPanel = ref(false)
const searchSuggestions = computed(() => {
  if (!searchQuery.value) return []
  
  // 从 tvShowsList 和 latestShows 中筛选匹配的内容
  const allShows = [...tvShowsList, ...latestShows]
  return allShows.filter(item => 
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  ).slice(0, 5)
})

// 处理搜索框失焦
const handleSearchBlur = () => {
  // 使用 setTimeout 确保点击建议项的事件能够触发
  setTimeout(() => {
    showSearchPanel.value = false
  }, 200)
}

// 处理建议项点击
const handleSuggestionClick = (item) => {
  goToDetail(item)
  showSearchPanel.value = false
}

// 高级搜索相关
const showAdvancedDrawer = ref(false)
const currentSearchType = ref('')
const advancedSearchTitle = computed(() => {
  const titles = {
    type: '按类型筛选',
    region: '按地区筛选',
    year: '按年份筛选',
    rating: '按评分筛选',
    custom: '自定义筛选'
  }
  return titles[currentSearchType.value] || '高级搜索'
})

// 筛选选项
const videoTypes = [
  '动作', '剧情', '科幻', '喜剧', '悬疑',
  '冒险', '犯罪', '奇幻', '恐怖', '爱情'
]
const regions = [
  { label: '全部', value: 'all' },
  { label: '中国大陆', value: 'cn' },
  { label: '中国香港', value: 'hk' },
  { label: '中国台湾', value: 'tw' },
  { label: '韩国', value: 'kr' },
  { label: '日本', value: 'jp' },
  { label: '欧美', value: 'us' }
]

// 选中的值
const selectedTypes = ref([])
const selectedRegion = ref('all')
const selectedYear = ref(new Date().getFullYear())
const selectedRating = ref(8.0)

// 处理高级搜索
const handleAdvancedSearch = (type) => {
  currentSearchType.value = type
  showAdvancedDrawer.value = true
}

// 切换类型选择
const toggleType = (type) => {
  const index = selectedTypes.value.indexOf(type)
  if (index === -1) {
    selectedTypes.value.push(type)
  } else {
    selectedTypes.value.splice(index, 1)
  }
}

// 重置筛选条件
const resetAdvancedSearch = () => {
  selectedTypes.value = []
  selectedRegion.value = 'all'
  selectedYear.value = new Date().getFullYear()
  selectedRating.value = 8.0
}

// 应用筛选
const applyAdvancedSearch = () => {
  showAdvancedDrawer.value = false
  ElMessage.success('筛选条件已应用')
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
}

/* Banner区域样式 */
.banner-section {
  margin-bottom: 40px;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  position: relative;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
  color: white;
  border-radius: 0 0 12px 12px;
}

.banner-content h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.banner-content p {
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.9;
}

/* 分类区域样式 */
.category-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  color: #e5e5e5;
  font-size: 24px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.category-card {
  background: linear-gradient(145deg, #2d2d2d, #333333);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  background: linear-gradient(145deg, #333333, #4CAF50);
}

.category-icon {
  font-size: 32px;
  color: #4CAF50;
  margin-bottom: 10px;
}

/* 内容网格样式 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.content-card {
  background: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.content-card:hover {
  transform: translateY(-5px);
}

.content-poster {
  position: relative;
  aspect-ratio: 2/3;
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.content-card:hover .content-overlay {
  opacity: 1;
}

.rating {
  color: #F7BA2A;
  font-size: 16px;
}

.content-info {
  padding: 12px;
}

.content-info h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #e5e5e5;
}

.meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 12px;
}

/* 最新上线区域样式 */
.latest-grid {
  display: flex;
  gap: 20px;
  padding: 10px;
}

.latest-card {
  flex: 0 0 200px;
  background: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.latest-card:hover {
  transform: translateY(-5px);
}

.latest-info {
  padding: 12px;
}

.latest-info h4 {
  margin: 0 0 8px 0;
  color: #e5e5e5;
}

.update-time {
  color: #999;
  font-size: 12px;
}

/* 会员专区样式 */
.vip-section {
  margin-top: 40px;
  padding: 40px;
  background: linear-gradient(145deg, #2d2d2d, #333333);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.vip-content {
  position: relative;
  z-index: 1;
}

.vip-info h2 {
  color: #F7BA2A;
  font-size: 32px;
  margin-bottom: 10px;
}

.vip-info p {
  color: #e5e5e5;
  margin-bottom: 20px;
}

.vip-benefits {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.vip-benefits li {
  color: #e5e5e5;
  margin-bottom: 10px;
}

.vip-benefits li .fa-check {
  color: #4CAF50;
  margin-right: 10px;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-carousel__item) {
  border-radius: 12px;
}

:deep(.el-radio-button__inner) {
  background-color: #2d2d2d;
  border-color: #404040;
  color: #b3b3b3;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .banner-content h2 {
    font-size: 24px;
  }
}

.banner-info {
  max-width: 600px;
}

.banner-meta {
  display: flex;
  gap: 20px;
  margin: 15px 0;
  font-size: 16px;
}

.banner-meta .rating {
  color: #F7BA2A;
}

.banner-tags {
  margin: 15px 0;
}

.banner-tags .el-tag {
  margin-right: 10px;
  background-color: rgba(255, 255, 255, 0.1);
}

.banner-actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.description {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-info .tags {
  margin-top: 8px;
}

.content-info .tags .el-tag {
  margin-right: 5px;
  background-color: rgba(76, 175, 80, 0.1);
  border: none;
}

.latest-poster {
  position: relative;
  aspect-ratio: 2/3;
}

.latest-overlay {
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

.latest-card:hover .latest-overlay {
  opacity: 1;
}

.latest-episode {
  background: rgba(76, 175, 80, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.latest-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.latest-meta .rating {
  color: #F7BA2A;
}

/* 优化响应式布局 */
@media (max-width: 768px) {
  .banner-content {
    padding: 20px;
  }
  
  .banner-info {
    max-width: 100%;
  }
  
  .banner-content h2 {
    font-size: 20px;
  }
  
  .description {
    -webkit-line-clamp: 2;
    font-size: 14px;
  }
  
  .banner-actions {
    flex-direction: column;
  }
}

/* 图片占位符样式 */
.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  gap: 10px;
}

.image-placeholder span {
  font-size: 14px;
}

/* 更新状态徽章样式 */
.update-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.update-badge.updating {
  background-color: #4CAF50;
}

.update-badge.finished {
  background-color: #909399;
}

/* 修改内容卡片的统一样式 */
.content-card {
  background: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.content-poster {
  position: relative;
  aspect-ratio: 2/3;
}

.content-poster .el-image {
  width: 100%;
  height: 100%;
}

.content-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 确保网格布局在所有区域保持一致 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* 统一标签样式 */
.category-tags .el-tag,
.filter-tags .el-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 8px;
}

.category-tags .el-tag.active,
.filter-tags .el-tag.active {
  background-color: #4CAF50;
  color: white;
}

.image-loading {
  width: 100%;
  height: 100%;
  background-color: #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-image {
  transition: opacity 0.3s ease;
}

.el-image.is-loading {
  opacity: 0.6;
}

/* 添加新的动画关键帧 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 为不同区域添加入场动画 */
.banner-section {
  animation: scaleIn 0.8s ease-out;
}

.trending-section {
  animation: fadeInUp 0.8s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.latest-section {
  animation: fadeInUp 0.8s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
}

/* 优化卡片悬浮效果 */
.content-card {
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

/* 优化按钮交互 */
.el-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
}

/* 优化标签交互 */
.el-tag {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
  }
  
  &.active {
    animation: pulse 1s infinite;
  }
}

/* 优化轮播图交互 */
.banner-item {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.02);
    
    .banner-content {
      background: linear-gradient(to top, 
        rgba(0,0,0,0.9) 0%, 
        rgba(0,0,0,0.7) 50%, 
        transparent 100%
      );
    }
  }
}

/* 优化图片加载动画 */
.image-loading {
  background: linear-gradient(
    90deg,
    #2d2d2d 25%,
    #333333 50%,
    #2d2d2d 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 优化评分显示 */
.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(247, 186, 42, 0.2);
  border-radius: 4px;
  backdrop-filter: blur(4px);
  
  .fa-star {
    color: #F7BA2A;
    animation: star 1s infinite;
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

/* 优化分类标签 */
.filter-tags, .category-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  .el-tag {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(76, 175, 80, 0.2);
    }
    
    &.active {
      background: #4CAF50;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }
  }
}

/* 优化内容信息显示 */
.content-info {
  transition: all 0.3s ease;
  
  h3 {
    transition: color 0.3s ease;
  }
  
  .meta {
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    .meta {
      opacity: 1;
    }
  }
}

/* 优化更新状态标签 */
.update-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  
  &.updating {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  }
  
  &.finished {
    background: linear-gradient(45deg, #909399, #808285);
    box-shadow: 0 2px 8px rgba(144, 147, 153, 0.3);
  }
}

/* 优化滚动条样式 */
.content-grid {
  scrollbar-width: thin;
  scrollbar-color: #4CAF50 #2d2d2d;
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4CAF50;
    border-radius: 3px;
    
    &:hover {
      background: #45a049;
    }
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .banner-content {
    padding: 20px;
    
    h2 {
      font-size: 20px;
    }
    
    .description {
      -webkit-line-clamp: 2;
      font-size: 14px;
    }
  }
  
  .banner-actions {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-tags, .category-tags {
    display: none;
  }
}

/* 在现有样式后添加 */
.search-section {
  margin: 20px 0 40px;
  padding: 20px;
  background: linear-gradient(145deg, #2d2d2d, #333333);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.search-input) {
  --el-input-bg-color: #242424;
  --el-input-border-color: #404040;
  --el-input-hover-border-color: #4CAF50;
  --el-input-focus-border-color: #4CAF50;
  
  .el-input__wrapper {
    padding-right: 0;
    box-shadow: none;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 0 0 1px #4CAF50;
    }
    
    &.is-focus {
      box-shadow: 0 0 0 1px #4CAF50;
    }
  }
  
  .el-input__inner {
    height: 50px;
    font-size: 16px;
    color: #e5e5e5;
    
    &::placeholder {
      color: #999;
    }
  }
  
  .el-input-group__append {
    background-color: transparent;
    border-color: #404040;
    padding: 0;
    
    .el-button {
      height: 50px;
      border: none;
      padding: 0 20px;
      border-radius: 0 8px 8px 0;
      
      &:hover {
        transform: translateY(0);
      }
    }
  }
}

.search-icon {
  color: #4CAF50;
  font-size: 18px;
  margin-right: 10px;
}

.hot-searches {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
}

.hot-label {
  color: #999;
  font-size: 14px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
}

.hot-icon {
  color: #ff4d4f;
  animation: flicker 1.5s infinite;
}

.hot-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  
  .el-tag {
    cursor: pointer;
    transition: all 0.3s ease;
    background: transparent;
    border-color: #404040;
    color: #b3b3b3;
    
    &:hover {
      transform: translateY(-2px);
      background: rgba(76, 175, 80, 0.1);
      border-color: #4CAF50;
      color: #4CAF50;
    }
  }
}

@keyframes flicker {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 搜索建议面板样式 */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #2d2d2d;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #404040;
  color: #e5e5e5;
}

.suggestion-content {
  max-height: 400px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  background: #404040;
}

.suggestion-thumb {
  width: 60px;
  height: 90px;
  border-radius: 4px;
  overflow: hidden;
}

.suggestion-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.suggestion-info {
  flex: 1;
}

.suggestion-info h4 {
  margin: 0 0 8px 0;
  color: #e5e5e5;
  font-size: 14px;
}

.suggestion-meta {
  display: flex;
  gap: 12px;
  color: #999;
  font-size: 12px;
  margin-bottom: 8px;
}

.suggestion-meta .rating {
  color: #F7BA2A;
}

.suggestion-tags {
  display: flex;
  gap: 8px;
}

.no-suggestions {
  padding: 32px;
  text-align: center;
  color: #666;
}

.no-suggestions .fa-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 优化搜索框样式 */
:deep(.search-input) {
  .el-input__wrapper {
    &:focus-within {
      box-shadow: 0 0 0 1px #4CAF50, 0 4px 12px rgba(76, 175, 80, 0.2);
    }
  }
  
  .el-input__inner {
    &::placeholder {
      transition: opacity 0.3s ease;
    }
    
    &:focus::placeholder {
      opacity: 0.5;
    }
  }
}

/* 优化下拉菜单样式 */
:deep(.el-dropdown-menu) {
  background: #2d2d2d;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  .el-dropdown-menu__item {
    color: #e5e5e5;
    
    &:hover {
      background: #404040;
      color: #4CAF50;
    }
    
    .fa-icon {
      width: 16px;
      margin-right: 8px;
      color: #4CAF50;
    }
  }
}

/* 高级搜索按钮样式 */
.advanced-search-btn {
  height: 50px;
  padding: 0 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 0 8px 8px 0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(0);
    background: #45a049;
  }
}

/* 下拉菜单样式 */
:deep(.advanced-search-menu) {
  min-width: 200px;
  padding: 8px;
  
  .el-dropdown-menu__item {
    padding: 12px;
    border-radius: 6px;
    
    &:hover {
      background: #404040;
    }
  }
  
  .dropdown-item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .arrow-icon {
      margin-left: auto;
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    &:hover .arrow-icon {
      opacity: 1;
      transform: translateX(4px);
    }
    
    &.highlight {
      color: #4CAF50;
    }
  }
}

/* 抽屉样式 */
:deep(.advanced-search-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 20px;
    border-bottom: 1px solid #404040;
  }
  
  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    
    h3 {
      margin: 0;
      font-size: 18px;
    }
  }
  
  .drawer-content {
    padding: 20px;
  }
  
  .filter-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #e5e5e5;
      font-size: 16px;
    }
  }
  
  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .el-check-tag {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &.is-checked {
        background: #4CAF50;
        color: white;
      }
    }
  }
  
  .region-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
  
  .year-picker {
    width: 100%;
  }
  
  .rating-slider {
    padding: 0 12px;
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

.dropdown-divider {
  margin: 8px 0;
  border-color: #404040;
}
</style>
