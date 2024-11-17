<template>
  <div class="member-container">
    <!-- 会员信息卡片 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="member-card" :body-style="{ padding: '20px' }">
          <div class="member-info">
            <div class="avatar-wrapper">
              <el-avatar 
                :size="80" 
                :src="userInfo.avatar"
                class="member-avatar"
              />
              <div class="member-level-badge">
                <font-awesome-icon icon="crown" class="crown-icon" />
              </div>
            </div>
            <div class="member-details">
              <h2>{{ userInfo.username }}</h2>
              <div class="member-level">
                <el-tag type="warning" effect="dark">
                  <font-awesome-icon icon="star" /> {{ userInfo.memberLevel }}
                </el-tag>
                <span class="expiry-date">
                  <font-awesome-icon icon="clock" /> 有效期至：{{ userInfo.expiryDate }}
                </span>
              </div>
            </div>
          </div>
          <div class="member-stats">
            <div class="stat-item">
              <font-awesome-icon icon="clock" class="stat-icon" />
              <h3>{{ userInfo.watchTime }}</h3>
              <span>观看时长</span>
            </div>
            <div class="stat-item">
              <font-awesome-icon icon="heart" class="stat-icon" />
              <h3>{{ userInfo.favorites }}</h3>
              <span>收藏数量</span>
            </div>
            <div class="stat-item">
              <font-awesome-icon icon="coins" class="stat-icon" />
              <h3>{{ userInfo.points }}</h3>
              <span>会员积分</span>
            </div>
          </div>
          <div class="member-growth">
            <div class="growth-info">
              <div class="current-level">
                <font-awesome-icon icon="crown" class="level-icon" />
                <span>当前等级：{{ userInfo.memberLevel }}</span>
              </div>
              <div class="next-level">
                距离下一等级还需：1200积分
              </div>
            </div>
            <el-progress 
              :percentage="70" 
              :format="format" 
              :color="levelColors"
              class="level-progress"
            >
              <template #default="{ percentage }">
                <span class="progress-label">{{ percentage }}%</span>
              </template>
            </el-progress>
            <div class="level-benefits">
              <div class="benefit-item" v-for="(benefit, index) in nextLevelBenefits" :key="index">
                <font-awesome-icon :icon="benefit.icon" class="benefit-icon" />
                <span>{{ benefit.name }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <!-- 会员升级对话框 --> 
    <el-dialog
      v-model="showUpgradeDialog"
      title="会员套餐"  
      width="60%"
      class="membership-dialog"
    >
      <div class="plans-container">
        <el-card 
          v-for="plan in membershipPlans" 
          :key="plan.id"
          class="plan-card"
          :class="{ 'recommended': plan.recommended }"
        >
          <h3>{{ plan.name }}</h3>
          <div class="plan-price">
            <span class="currency">¥</span>
            <span class="amount">{{ plan.price }}</span>
            <span class="period">/{{ plan.period }}</span>
          </div>
          <ul class="plan-features">
            <li v-for="feature in plan.features" :key="feature">
              <font-awesome-icon icon="check" class="feature-icon" />
              {{ feature }}
            </li>
          </ul>
          <el-button 
            type="primary" 
            :class="{ 'is-recommended': plan.recommended }"
            @click="selectPlan(plan)"
          >
            立即开通
          </el-button>
          <div v-if="plan.recommended" class="recommended-badge">
            <font-awesome-icon icon="crown" /> 推荐
          </div>
        </el-card>
      </div>
    </el-dialog>

    <!-- 会员权益部分 -->
    <div class="vip-benefits">
      <h2 class="section-title">
        <font-awesome-icon icon="crown" class="title-icon" />
        会员权益
      </h2>
      <div class="benefits-grid">
        <div class="benefit-card" v-for="benefit in benefits" :key="benefit.id">
          <div class="benefit-icon">
            <font-awesome-icon :icon="benefit.icon" />
          </div>
          <div class="benefit-content">
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
          <el-tag 
            :type="benefit.active ? 'success' : 'info'" 
            class="benefit-status"
            effect="dark"
          >
            {{ benefit.active ? '已开通' : '未开通' }}
          </el-tag>
        </div>
      </div>
    </div>

  
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const showUpgradeDialog = ref(false)

// 用户信息
const userInfo = {
  username: '测试用户',
  avatar: 'https://image.tmdb.org/t/p/w500/wojZYXQhvqVFp8QyxQzBKwVkxeX.jpg',
  memberLevel: '黄金会员',
  expiryDate: '2024-12-31',
  watchTime: '286小时',
  favorites: 48,
  points: 2860
}

// 会员权益
const benefits = [
  {
    id: 1,
    title: '4K超清观影',
    description: '享受极致清晰的观影体验',
    icon: 'tv',
    active: true
  },
  {
    id: 2,
    title: '免广告观看',
    description: '告别广告打扰，沉浸式观影',
    icon: 'ban',
    active: true
  },
  {
    id: 3,
    title: '会员专享内容',
    description: '抢先观看会员专享剧集',
    icon: 'crown',
    active: true
  },
  {
    id: 4,
    title: '离线下载',
    description: '随时随地，想看就看',
    icon: 'download',
    active: true
  },
  {
    id: 5,
    title: '多端同步',
    description: '跨设备同步观看进度',
    icon: 'sync',
    active: true
  } 
]

// 观看历史
const watchHistory = [
  {
    id: 1,
    title: '流浪地球2',
    image: 'https://image.tmdb.org/t/p/w500/pR858ihc6Ls9xohpdRJVjV787ml.jpg',
    watchTime: '2024-03-18 15:30',
    progress: '01:23:45',
    progressPercentage: 70
  },
  {
    id: 2,
    title: '满江红',
    image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
    watchTime: '2024-03-17 20:15',
    progress: '00:45:30',
    progressPercentage: 30
  }
]

// 收藏列表
const favorites = [
  {
    id: 1,
    title: '阿凡达：水之道',
    cover: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    addTime: '2024-03-18'
  },
  {
    id: 2,
    title: '蚁人与黄蜂女',
    cover: 'https://image.tmdb.org/t/p/w500/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg',
    addTime: '2024-03-17'
  }
]

// 消费记录
const consumptionHistory = [
  {
    id: 1,
    content: '购买年度会员',
    amount: '-￥298.00',
    time: '2024-03-18 15:30:00',
    type: 'success'
  },
  {
    id: 2,
    content: '观影券返还',
    amount: '+￥30.00',
    time: '2024-03-17 20:15:00',
    type: 'warning'
  }
]

// 账号设置
const accountSettings = ref({
  username: '测试用户',
  email: 'test@example.com',
  phone: '13800138000',
  notifications: {
    email: true,
    sms: false
  }
})

// 会员套餐
const membershipPlans = [
  {
    id: 1,
    name: '月度会员',
    price: 30,
    period: '月',
    features: [
      '1080P高清视频',
      '无广告观看',
      '2台设备同时在线'
    ]
  },
  {
    id: 2,
    name: '季度会员',
    price: 88,
    period: '季',
    recommended: true,
    features: [
      '4K超清视频',
      '无广告观看',
      '4台设备同时在线',
      '杜比全景声'
    ]
  },
  {
    id: 3,
    name: '年度会员',
    price: 298,
    period: '年',
    features: [
      '8K超高清频',
      '无广告看',
      '6台设备同时在线',
      '杜比全景声',
      '离线下载'
    ]
  }
]

// 进度条颜色
const customColors = [
  { color: '#4CAF50', percentage: 20 },
  { color: '#4CAF50', percentage: 40 },
  { color: '#4CAF50', percentage: 60 },
  { color: '#4CAF50', percentage: 80 },
  { color: '#4CAF50', percentage: 100 }
]

// 表格行样式
const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex === 0) {
    return 'latest-watch'
  }
  return ''
}

// 继续观看
const continueWatch = (video) => {
  router.push({
    name: 'video',
    params: { id: video.id }
  })
}

// 选择会员套餐
const selectPlan = (plan) => {
  ElMessage.success(`已选择${plan.name}套餐，即将跳转支付`)
  showUpgradeDialog.value = false
}

// 保存设置
const saveSettings = () => {
  ElMessage.success('设置已保存')
}

// 积分商城商品
const pointsItems = [
  {
    id: 1,
    name: '30天会员',
    points: 3000,
    image: 'https://example.com/vip.jpg'
  },
  {
    id: 2,
    name: '观影券',
    points: 500,
    image: 'https://example.com/ticket.jpg'
  },
  {
    id: 3,
    name: '限定头像框',
    points: 1000,
    image: 'https://example.com/avatar-frame.jpg'
  },
  {
    id: 4,
    name: '主题换肤',
    points: 800,
    image: 'https://example.com/theme.jpg'
  }
]

// 在线设备
const activeDevices = [
  {
    id: 1,
    name: 'iPhone 13 Pro',
    icon: 'mobile-alt',
    location: '广东省广州市',
    lastActive: '2024-03-18 15:30:00',
    ip: '192.168.1.100'
  },
  {
    id: 2,
    name: 'MacBook Pro',
    icon: 'laptop',
    location: '广东省广州市',
    lastActive: '2024-03-18 15:28:00',
    ip: '192.168.1.101'
  }
]

// 兑换商品
const exchangeItem = (item) => {
  ElMessageBox.confirm(
    `确定要使用 ${item.points} 积分兑换 ${item.name} 吗？`,
    '确认兑换',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('兑换成功')
  }).catch(() => {})
}

// 断开设备连接
const disconnectDevice = (device) => {
  ElMessageBox.confirm(
    `确定要断开设备 ${device.name} 的连接吗？`,
    '确认断开',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('设备已断开连接')
  }).catch(() => {})
}

// 断开所有设备
const disconnectAll = () => {
  ElMessageBox.confirm(
    '确定要断开所有设备的连接吗？',
    '确认断开',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('所有设备已断开连接')
  }).catch(() => {})
}

// 等级进度条颜色
const levelColors = [
  { color: '#95c758', percentage: 20 },
  { color: '#67c23a', percentage: 40 },
  { color: '#4CAF50', percentage: 60 },
  { color: '#409EFF', percentage: 80 },
  { color: '#7B69EE', percentage: 100 }
]

// 进度条格式化
const format = (percentage) => {
  return `${percentage}%`
}

// 下一等级权益
const nextLevelBenefits = [
  { name: '8K超清', icon: 'tv' },
  { name: '8台设备', icon: 'mobile-alt' },
  { name: '专属客服', icon: 'headset' },
  { name: 'VIP礼包', icon: 'gift' }
]

// 帮助中心链接
const helpLinks = [
  { text: '常见问题', icon: 'question-circle', action: 'faq' },
  { text: '会员服务', icon: 'crown', action: 'vip-service' },
  { text: '意见反馈', icon: 'comment', action: 'feedback' },
  { text: '联系客服', icon: 'headset', action: 'contact' }
]

// 处理底部链接点击
const handleFooterLink = (action) => {
  console.log('Footer link clicked:', action)
  // 这里可以添加具体的处理逻辑
}
</script>

<style scoped>
/* 基础样式 */
.member-container {
  padding: 20px;
  animation: fadeInUp 0.6s ease-out;
}

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

/* 会员卡片样式优化 */
.member-card {
  width: 100%;
  margin-bottom: 20px;
  background: linear-gradient(145deg, #2d2d2d, #333333);
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.member-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* 会员头像样式 */
.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.member-avatar {
  border: 3px solid #4CAF50;
  transition: transform 0.3s ease;
}

.member-avatar:hover {
  transform: scale(1.05);
}

.member-level-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  background: linear-gradient(145deg, #4CAF50, #45a049);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

/* 会员信息样式 */
.member-details h2 {
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.member-level {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 统计数据样式 */
.member-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 30px 0;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
  background: rgba(76, 175, 80, 0.15);
}

.stat-item h3 {
  font-size: 24px;
  color: #4CAF50;
  margin: 10px 0;
}

.stat-icon {
  font-size: 24px;
  color: #4CAF50;
  opacity: 0.9;
  transition: transform 0.3s ease;
}

.stat-item:hover .stat-icon {
  transform: scale(1.1);
}

/* 标签页样式优化 */
.tabs-section {
  margin-top: 30px;
}

:deep(.el-tabs__nav) {
  background-color: #2d2d2d;
  border-radius: 8px 8px 0 0;
  padding: 0 20px;
}

:deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  transition: all 0.3s ease;
}

:deep(.el-tabs__item:hover) {
  color: #4CAF50 !important;
  transform: translateY(-2px);
}

/* 表格样式优化 */
:deep(.el-table) {
  background-color: transparent;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #2d2d2d;
  color: #e5e5e5;
  font-weight: 600;
}

:deep(.el-table td) {
  color: #b3b3b3;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: rgba(45, 45, 45, 0.4);
}

/* 收藏卡片样式 */
.favorite-card {
  transition: all 0.3s ease;
  transform-origin: center;
  overflow: hidden;
}

.favorite-card:hover {
  transform: scale(1.03);
}

.favorite-cover {
  position: relative;
  overflow: hidden;
}

.favorite-cover img {
  transition: transform 0.6s ease;
}

.favorite-card:hover .favorite-cover img {
  transform: scale(1.1);
}

.favorite-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
  transition: all 0.3s ease;
}

.favorite-card:hover .favorite-actions {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

/* 会员套餐卡片样式 */
.plan-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-10px);
}

.plan-card::before {
  content: '';
  position: absolute;
  top: -100%;
  left: -100%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  transition: all 0.6s ease;
}

.plan-card:hover::before {
  top: 100%;
  left: 100%;
}

.recommended-badge {
  position: absolute;
  top: -15px;
  right: -15px;
  background: linear-gradient(145deg, #4CAF50, #45a049);
  color: white;
  padding: 20px;
  transform: rotate(45deg);
  width: 60px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 积分商城样式 */
.points-item {
  transition: all 0.3s ease;
}

.points-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.points-item-image {
  transition: transform 0.6s ease;
}

.points-item:hover .points-item-image {
  transform: scale(1.1);
}

/* 设备管理样式 */
.device-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.device-icon {
  font-size: 24px;
  color: #4CAF50;
  transition: transform 0.3s ease;
}

.device-info:hover .device-icon {
  transform: scale(1.1);
}

/* 表单样式优化 */
:deep(.el-input__wrapper) {
  background-color: #2d2d2d !important;
  border: 1px solid #404040;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #4CAF50;
  box-shadow: 0 0 0 1px #4CAF50 !important;
}

:deep(.el-button--primary) {
  background: linear-gradient(145deg, #4CAF50, #45a049);
  border: none;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

/* 会员成长体系样式 */
.member-growth {
  margin-top: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.growth-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.current-level {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4CAF50;
  font-weight: bold;
}

.level-icon {
  font-size: 20px;
  color: #F7BA2A;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.next-level {
  color: #b3b3b3;
  font-size: 14px;
}

.level-progress {
  margin: 20px 0;
}

:deep(.el-progress-bar__outer) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-progress-bar__inner) {
  transition: width 0.6s ease !important;
}

.progress-label {
  color: #fff;
  font-weight: bold;
}

.level-benefits {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.benefit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  transform: translateY(-3px);
  background-color: rgba(76, 175, 80, 0.15);
}

.benefit-icon {
  font-size: 24px;
  color: #4CAF50;
}

/* 优化卡片动画 */
.member-card, .benefits-card {
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 优化标签页切换动画 */
:deep(.el-tabs__content) {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 优化表格悬浮效果 */
:deep(.el-table__row) {
  transition: all 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: rgba(76, 175, 80, 0.1) !important;
  transform: scale(1.01);
}

/* 优化按钮动画 */
:deep(.el-button) {
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* 优化表单控件动画 */
:deep(.el-input__wrapper) {
  transition: all 0.3s ease !important;
}

:deep(.el-input__wrapper:focus-within) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2) !important;
}

/* 会员权益样式 */
.vip-benefits {
  padding: 40px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: #e5e5e5;
  
  .title-icon {
    color: #F7BA2A;
  }
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.benefit-card {
  background: linear-gradient(145deg, #2d2d2d, #333333);
  border-radius: 12px;
  padding: 24px;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
}

.benefit-icon {
  width: 48px;
  height: 48px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  .fa-icon {
    font-size: 24px;
    color: #4CAF50;
  }
}

.benefit-content {
  h3 {
    color: #e5e5e5;
    margin: 0 0 8px 0;
    font-size: 18px;
  }
  
  p {
    color: #999;
    margin: 0;
    font-size: 14px;
  }
}

.benefit-status {
  position: absolute;
  top: 24px;
  right: 24px;
}

/* 页面底部样式 */
.page-footer {
  background: #2d2d2d;
  padding: 60px 0 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-section {
  h3 {
    color: #e5e5e5;
    margin: 0 0 20px 0;
    font-size: 18px;
  }
}

.help-center {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 12px;
  }
  
  a {
    color: #999;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.3s ease;
    
    &:hover {
      color: #4CAF50;
    }
  }
}

.contact-methods {
  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #999;
    margin-bottom: 12px;
  }
}

.social-media {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  
  .social-btn {
    background: transparent;
    border: 1px solid #404040;
    color: #999;
    transition: all 0.3s ease;
    
    &:hover {
      background: #4CAF50;
      border-color: #4CAF50;
      color: white;
      transform: translateY(-2px);
    }
  }
}

.qr-wrapper {
  text-align: center;
  
  .el-image {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    margin-bottom: 12px;
  }
  
  p {
    color: #999;
    font-size: 14px;
    margin: 0;
  }
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  background: #404040;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 32px;
}

.footer-bottom {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 20px;
  border-top: 1px solid #404040;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  
  p {
    margin: 0;
  }
  
  .footer-links {
    display: flex;
    gap: 20px;
    
    a {
      color: #666;
      text-decoration: none;
      transition: color 0.3s ease;
      
      &:hover {
        color: #4CAF50;
      }
    }
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}
</style> 