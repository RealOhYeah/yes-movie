<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isDarkTheme = ref(true)
const hasNewNotification = ref(true)

// 计算当前路径
const currentPath = computed(() => {
  const pathMap = {
    '/': '首页',
    '/member': '会员中心',
    '/tv': '电视剧',
    '/movie': '电影'
  }
  return pathMap[route.path] || '未知页面'
})

// 添加更多通知类型
const notifications = [
  {
    id: 1,
    title: '会员特权更新',
    description: '尊敬的用户，您的会员特权已更新，新增4K观影特权',
    time: '10分钟前',
    read: false,
    type: 'success',
    icon: 'crown',
    link: '/member'
  },
  {
    id: 2,
    title: '新剧上线提醒',
    description: '您关注的《继承之战》最终季更新了第10集',
    time: '30分钟前',
    read: false,
    type: 'info',
    icon: 'film',
    link: '/tv/1'
  },
  {
    id: 3,
    title: '系统通知',
    description: '系统将于今晚02:00-04:00进行例行维护',
    time: '2小时前',
    read: true,
    type: 'warning',
    icon: 'info-circle'
  },
  {
    id: 4,
    title: '观看进度同步',
    description: '您在移动端的观看进度已同步',
    time: '3小时前',
    read: true,
    type: 'info',
    icon: 'sync',
    link: '/history'
  }
]

// 通知相关方法
const markAllAsRead = () => {
  notifications.forEach(notice => notice.read = true)
  hasNewNotification.value = false
  ElMessage.success('已全部标记为已读')
}

const handleNotification = (notice) => {
  notice.read = true
  if (notice.link) {
    router.push(notice.link)
  }
  ElMessage.success(`查看通知: ${notice.title}`)
}

// 用户菜单命令处理
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/member')
      break
    case 'history':
      router.push('/member?tab=history')
      break
    case 'favorites':
      router.push('/member?tab=favorites')
      break
    case 'settings':
      router.push('/member?tab=settings')
      break
    case 'vip':
      ElMessageBox.confirm(
        '开通会员即可享受更多精彩内容',
        '开通会员',
        {
          confirmButtonText: '立即开通',
          cancelButtonText: '暂不开通',
          type: 'warning'
        }
      ).then(() => {
        router.push('/member?tab=vip')
      }).catch(() => {})
      break
    case 'logout':
      ElMessageBox.confirm(
        '确定要退出登录吗？',
        '退出确认',
        {
          confirmButtonText: '确定退出',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage.success('退出成功')
        // 这里可以添加登出逻辑
      }).catch(() => {})
      break
  }
}

// 主题切换
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  // 这里可以添加主题切换逻辑
  ElMessage({
    message: `已切换到${isDarkTheme.value ? '深色' : '浅色'}主题`,
    type: 'success',
    icon: isDarkTheme.value ? 'moon' : 'sun'
  })
}

// 计算未读通知数量
const unreadCount = computed(() => {
  return notifications.filter(notice => !notice.read).length
})
</script>

<template>
  <div class="top-nav">
    <div class="nav-left">
      <div class="breadcrumb">
        <div class="icon-wrapper">
          <font-awesome-icon icon="compass" class="nav-icon pulse" />
        </div>
        <div class="path-container">
          <span class="path-text">{{ currentPath }}</span>
        </div>
      </div>
    </div>

    <div class="nav-right">
      <!-- 通知中心 -->
      <el-popover
        placement="bottom"
        :width="320"
        trigger="click"
        popper-class="notification-popover"
      >
        <template #reference>
          <div class="nav-item notification-icon" :class="{ 'has-new': unreadCount > 0 }">
            <el-badge :value="unreadCount" :max="99" :hidden="unreadCount === 0">
              <font-awesome-icon icon="bell" class="nav-icon" />
            </el-badge>
          </div>
        </template>
        <div class="notification-panel">
          <div class="notification-header">
            <h3>通知中心</h3>
            <el-button 
              link 
              type="primary" 
              size="small"
              :disabled="unreadCount === 0"
              @click="markAllAsRead"
            >
              全部标记为已读
            </el-button>
          </div>
          <div class="notification-list">
            <template v-if="notifications.length">
              <div 
                v-for="notice in notifications" 
                :key="notice.id" 
                class="notification-item"
                :class="{ 
                  unread: !notice.read,
                  clickable: notice.link,
                  'with-hover': notice.link 
                }"
                @click="handleNotification(notice)"
              >
                <div class="notification-icon-wrapper">
                  <div class="notification-icon" :class="notice.type">
                    <font-awesome-icon :icon="notice.icon" />
                    <div class="icon-pulse"></div>
                  </div>
                </div>
                <div class="notification-content">
                  <div class="notification-title">
                    {{ notice.title }}
                    <el-tag 
                      v-if="!notice.read" 
                      size="small" 
                      effect="dark" 
                      class="unread-tag"
                    >
                      新
                    </el-tag>
                  </div>
                  <div class="notification-desc">{{ notice.description }}</div>
                  <div class="notification-time">{{ notice.time }}</div>
                </div>
              </div>
            </template>
            <div v-else class="empty-notifications">
              <font-awesome-icon icon="bell-slash" />
              <p>暂无通知</p>
            </div>
          </div>
          <div class="notification-footer">
            <el-button link type="primary" size="small">
              查看全部通知
              <font-awesome-icon icon="angle-right" />
            </el-button>
          </div>
        </div>
      </el-popover>

      <!-- 用户信息 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <div class="avatar-container">
            <el-avatar :size="36" class="user-avatar">
              <img src="https://www.themoviedb.org/t/p/w500/wojZYXQhvqVFp8QyxQzBKwVkxeX.jpg" alt="avatar">
            </el-avatar>
            <div class="avatar-status" title="VIP会员">
              <font-awesome-icon icon="crown" class="status-icon" />
            </div>
            <div class="avatar-ring"></div>
          </div>
          <div class="user-detail">
            <span class="username">测试用户</span>
            <span class="user-level">
              <font-awesome-icon icon="crown" class="vip-icon" />
              黄金会员
            </span>
          </div>
          <div class="dropdown-indicator">
            <font-awesome-icon icon="chevron-down" class="dropdown-icon" />
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <div class="dropdown-header">
              <el-avatar :size="50" class="large-avatar">
                <img src="https://www.themoviedb.org/t/p/w500/wojZYXQhvqVFp8QyxQzBKwVkxeX.jpg" alt="avatar">
              </el-avatar>
              <div class="header-info">
                <span class="header-name">测试用户</span>
                <span class="header-email">user@example.com</span>
              </div>
            </div>
            <div class="vip-info">
              <div class="vip-status">
                <font-awesome-icon icon="crown" class="vip-icon" />
                <span>黄金会员</span>
              </div>
              <div class="vip-expiry">有效期至：2024-12-31</div>
            </div>
            <el-divider class="dropdown-divider" />
            <el-dropdown-item command="profile">
              <div class="dropdown-item-content">
                <font-awesome-icon icon="user" />
                <span>个人中心</span>
                <font-awesome-icon icon="chevron-right" class="item-arrow" />
              </div>
            </el-dropdown-item>
            <el-dropdown-item command="history">
              <font-awesome-icon icon="history" /> 观看历史
              <font-awesome-icon icon="chevron-right" class="item-arrow" />
            </el-dropdown-item>
            <el-dropdown-item command="favorites">
              <font-awesome-icon icon="heart" /> 我的收藏
              <font-awesome-icon icon="chevron-right" class="item-arrow" />
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <font-awesome-icon icon="cog" /> 设置
              <font-awesome-icon icon="chevron-right" class="item-arrow" />
            </el-dropdown-item>
            <el-divider class="dropdown-divider" />
            <el-dropdown-item command="vip" class="vip-item">
              <font-awesome-icon icon="crown" class="vip-icon" /> 
              <span>开通会员</span>
              <el-tag size="small" type="warning" class="vip-tag">限时优惠</el-tag>
            </el-dropdown-item>
            <el-divider class="dropdown-divider" />
            <el-dropdown-item command="logout">
              <font-awesome-icon icon="sign-out-alt" /> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 主题切换 -->
      <div class="nav-item theme-toggle" 
           @click="toggleTheme" 
           :title="isDarkTheme ? '切换到浅色模式' : '切换到深色模式'"
      >
        <div class="theme-icon-wrapper">
          <transition name="theme-switch" mode="out-in">
            <font-awesome-icon 
              :key="isDarkTheme" 
              :icon="isDarkTheme ? 'sun' : 'moon'" 
              class="nav-icon"
            />
          </transition>
        </div>
        <div class="theme-ripple"></div>
        <div class="theme-glow"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 顶部导航基础样式 */
.top-nav {
  height: 64px;
  padding: 0 24px;
  background: linear-gradient(145deg, #2d2d2d, #333333);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1000;
}

/* 左侧区域样式 */
.nav-left {
  display: flex;
  align-items: center;
  margin-right: 24px;
}

.breadcrumb {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(76, 175, 80, 0.3);
    transform: translateY(-1px);
  }
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  .nav-icon {
    color: #4CAF50;
    font-size: 18px;
    filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
  }
  
  &:hover {
    background: rgba(76, 175, 80, 0.15);
    transform: scale(1.05);
  }
}

.path-container {
  position: relative;
  overflow: hidden;
  padding: 4px 0;
}

.path-text {
  color: #e5e5e5;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 200px;
  display: block;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

/* 右侧区域样式 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.05);
    
    &::before {
      width: 300%;
      height: 300%;
    }
    
    .nav-icon {
      transform: scale(1.1);
      color: #4CAF50;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

.nav-icon {
  font-size: 18px;
  color: #e5e5e5;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    border-color: rgba(76, 175, 80, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    
    .dropdown-icon {
      transform: rotate(180deg);
    }
    
    .user-avatar {
      transform: scale(1.05);
      border-color: #4CAF50;
    }
  }
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.avatar-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(45deg, #F7BA2A, #FFD700);
  border: 2px solid #2d2d2d;
  animation: pulse 2s infinite;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  color: #e5e5e5;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-level {
  color: #F7BA2A;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  .vip-icon {
    font-size: 12px;
    filter: drop-shadow(0 2px 4px rgba(247, 186, 42, 0.3));
  }
}

/* 通知中心样式 */
.notification-icon {
  position: relative;
  
  &.has-new::after {
    content: '';
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background: linear-gradient(45deg, #F56C6C, #ff7875);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

:deep(.notification-popover) {
  border: none;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  
  .el-popover__title {
    font-weight: 500;
  }
}

.notification-panel {
  background: #2d2d2d;
}

.notification-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(145deg, #333333, #2d2d2d);
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #e5e5e5;
  }
}

.notification-list {
  max-height: 360px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4CAF50;
    border-radius: 2px;
  }
}

.notification-item {
  padding: 16px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background: transparent;
    transition: all 0.3s ease;
  }
  
  &.unread::before {
    background: #4CAF50;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    padding-left: 20px;
    
    .notification-icon {
      transform: scale(1.1);
    }
    
    .notification-title {
      color: #4CAF50;
    }
  }
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &.success::after { 
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
  }
  
  &.info::after { 
    box-shadow: 0 0 20px rgba(64, 158, 255, 0.3);
  }
  
  &.warning::after { 
    box-shadow: 0 0 20px rgba(230, 162, 60, 0.3);
  }
  
  &:hover::after {
    opacity: 1;
  }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #e5e5e5;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  font-size: 12px;
  color: #666;
}

.notification-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  background: linear-gradient(145deg, #2d2d2d, #333333);
}

/* 主题切换按钮样式 */
.theme-toggle {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  
  .theme-icon-wrapper {
    position: relative;
    z-index: 2;
  }
  
  .theme-ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(
      circle,
      rgba(76, 175, 80, 0.2) 0%,
      rgba(76, 175, 80, 0.1) 50%,
      transparent 100%
    );
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.6s ease-out;
  }
  
  .theme-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(
      circle,
      rgba(76, 175, 80, 0.2),
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.6s ease;
    z-index: 1;
  }
  
  &:hover {
    .theme-ripple {
      width: 200%;
      height: 200%;
    }
    
    .theme-glow {
      width: 200%;
      height: 200%;
    }
  }
  
  &:active .theme-ripple {
    background: radial-gradient(
      circle,
      rgba(76, 175, 80, 0.3) 0%,
      rgba(76, 175, 80, 0.2) 50%,
      transparent 100%
    );
  }
}

/* 动画效果 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(245, 108, 108, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(245, 108, 108, 0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .top-nav {
    padding: 0 16px;
  }
  
  .nav-right {
    gap: 16px;
  }
  
  .user-detail {
    display: none;
  }
  
  .breadcrumb {
    padding: 6px 12px;
    gap: 12px;
  }
  
  .icon-wrapper {
    width: 28px;
    height: 28px;
    
    .nav-icon {
      font-size: 16px;
    }
  }
  
  .path-text {
    max-width: 150px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .nav-right {
    gap: 12px;
  }
  
  .notification-panel {
    width: 300px;
  }
}

/* 修改下拉菜单样式 */
:deep(.user-dropdown) {
  background: linear-gradient(145deg, #2d2d2d, #333333);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  
  .dropdown-header {
    background: linear-gradient(145deg, #333333, #2d2d2d);
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .dropdown-item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0;
    
    .item-arrow {
      margin-left: auto;
      opacity: 0;
      transform: translateX(-10px);
      transition: all 0.3s ease;
    }
  }
  
  .el-dropdown-menu__item {
    background: transparent;
    
    &:hover {
      background: rgba(76, 175, 80, 0.1);
      
      .item-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    &:active {
      background: rgba(76, 175, 80, 0.2);
    }
  }
  
  .vip-info {
    background: linear-gradient(145deg, rgba(247, 186, 42, 0.1), rgba(255, 215, 0, 0.1));
  }
}

/* 添加主题切换动画 */
@keyframes themeSwitch {
  0% {
    transform: scale(1) rotate(0);
  }
  50% {
    transform: scale(0.5) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
  }
}

.nav-icon {
  animation: themeSwitch 0.6s ease-out;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .path-text {
    max-width: 120px;
  }
  
  .theme-toggle {
    width: 36px;
    height: 36px;
  }
}

/* 用户头像样式优化 */
.avatar-container {
  position: relative;
  margin-right: 12px;
}

.avatar-ring {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: linear-gradient(145deg, #4CAF50, #F7BA2A) border-box;
  -webkit-mask: 
    linear-gradient(#fff 0 0) padding-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  animation: rotate 4s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .avatar-ring {
  opacity: 1;
}

.status-icon {
  font-size: 8px;
  animation: pulse 2s infinite;
}

/* 通知图标样式优化 */
.notification-icon-wrapper {
  position: relative;
}

.icon-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  animation: iconPulse 2s infinite;
  opacity: 0;
}

.notification-item.with-hover:hover .icon-pulse {
  opacity: 1;
}

.notification-item.with-hover {
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  
  &:hover::after {
    transform: translateX(100%);
  }
}

/* 主题切换动画优化 */
.theme-icon-wrapper {
  position: relative;
  z-index: 2;
}

.theme-switch-enter-active,
.theme-switch-leave-active {
  transition: all 0.3s ease;
}

.theme-switch-enter-from {
  transform: rotate(-180deg) scale(0);
  opacity: 0;
}

.theme-switch-leave-to {
  transform: rotate(180deg) scale(0);
  opacity: 0;
}

.theme-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(
    circle,
    rgba(76, 175, 80, 0.2),
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
  z-index: 1;
}

.theme-toggle:hover .theme-glow {
  width: 200%;
  height: 200%;
}

/* 下拉菜单交互优化 */
.dropdown-indicator {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* 新增动画 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes iconPulse {
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

/* 响应式优化 */
@media (max-width: 768px) {
  .avatar-ring {
    display: none;
  }
  
  .notification-icon-wrapper {
    transform: scale(0.9);
  }
}

/* 优化通知中心的样式 */
.notification-item {
  padding: 16px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background: transparent;
    transition: all 0.3s ease;
  }
  
  &.unread::before {
    background: #4CAF50;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    padding-left: 20px;
    
    .notification-icon {
      transform: scale(1.1);
    }
    
    .notification-title {
      color: #4CAF50;
    }
  }
}

/* 优化通知图标样式 */
.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &.success::after { 
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
  }
  
  &.info::after { 
    box-shadow: 0 0 20px rgba(64, 158, 255, 0.3);
  }
  
  &.warning::after { 
    box-shadow: 0 0 20px rgba(230, 162, 60, 0.3);
  }
  
  &:hover::after {
    opacity: 1;
  }
}

/* 优化用户头像区域 */
.user-info {
  &:hover {
    .avatar-ring {
      animation: rotateGradient 2s linear infinite;
    }
    
    .avatar-status {
      transform: scale(1.2);
    }
  }
}

.avatar-ring {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.avatar-status {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

/* 优化主题切换按钮 */
.theme-toggle {
  isolation: isolate;
  
  .theme-icon-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  &:hover .theme-icon-wrapper {
    transform: rotate(180deg);
  }
  
  .nav-icon {
    font-size: 18px;
    background: linear-gradient(45deg, #4CAF50, #45a049);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
  }
}

/* 优化下拉菜单交互 */
.dropdown-icon {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 新增动画关键帧 */
@keyframes rotateGradient {
  0% {
    transform: rotate(0deg);
    background: linear-gradient(45deg, #4CAF50, #F7BA2A);
  }
  50% {
    background: linear-gradient(225deg, #4CAF50, #F7BA2A);
  }
  100% {
    transform: rotate(360deg);
    background: linear-gradient(45deg, #4CAF50, #F7BA2A);
  }
}

/* 优化响应式表现 */
@media (max-width: 768px) {
  .notification-item {
    padding: 12px;
    
    &:hover {
      padding-left: 16px;
    }
  }
  
  .notification-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .theme-toggle {
    width: 36px;
    height: 36px;
    
    .nav-icon {
      font-size: 16px;
    }
  }
}
</style> 