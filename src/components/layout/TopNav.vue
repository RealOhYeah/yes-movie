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
      }).catch(() => { })
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
      }).catch(() => { })
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

// 根据路径获取对应图标
const getPathIcon = computed(() => {
  const iconMap = {
    '/': 'home',
    '/member': 'user',
    '/tv': 'tv',
    '/movie': 'film',
    '/free': 'gift',
    '/short': 'video',
    '/variety': 'theater-masks',
    '/anime': 'dragon',
    '/documentary': 'photo-video',
    '/children': 'child'
  }
  return iconMap[route.path] || 'compass'
})

// 用户信息
const userInfo = {
  username: '试用户',
  avatar: 'https://www.themoviedb.org/t/p/w500/wojZYXQhvqVFp8QyxQzBKwVkxeX.jpg',
  online: true,
  memberLevel: '黄金会员',
  email: 'user@example.com'
}
</script>

<template>
  <div class="top-nav">
    <div class="nav-left">
      <div class="breadcrumb">
        <div class="icon-wrapper">
          <font-awesome-icon :icon="getPathIcon" class="nav-icon" />
        </div>
        <div class="path-container">
          <transition name="fade" mode="out-in">
            <span :key="currentPath" class="path-text">{{ currentPath }}</span>
          </transition>
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
        style="background-color: #1a1a1a"
      >
        <template #reference>
          <div
            class="nav-item notification-icon"
            :class="{ 'has-new': unreadCount > 0 }"
          >
            <el-badge
              :value="unreadCount"
              :max="99"
              :hidden="unreadCount === 0"
            >
              <font-awesome-icon icon="bell" class="nav-icon" />
            </el-badge>
          </div>
        </template>

        <div style="background-color: #1a1a1a !important">
          <div class="notification-panel" style="background-color: #1a1a1a">
            <div class="notification-header" style="background-color: #1a1a1a">
              <h3>通知中心</h3>
              <el-button
                link
                type="primary"
                size="small"
                :disabled="unreadCount === 0"
                @click="markAllAsRead"
                class="mark-read-btn"
              >
                <font-awesome-icon icon="check-double" class="mark-icon" />
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
                    'with-hover': notice.link,
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
                    <div class="notification-desc">
                      {{ notice.description }}
                    </div>
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
        </div>
      </el-popover>

      <!-- 用户信息 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <div class="avatar-container">
            <el-avatar :size="36" class="user-avatar">
              <!-- <img :src="userInfo.avatar" alt="avatar">  -->
            </el-avatar>
            <div class="avatar-status" :class="{ online: userInfo.online }">
              <font-awesome-icon
                :icon="userInfo.online ? 'circle' : 'circle-dot'"
                class="status-icon"
              />
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
          <el-dropdown-menu
            class="user-dropdown"
            style="background-color: #1a1a1a"
          >
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
              <el-tag size="small" type="warning" class="vip-tag"
                >限时优惠</el-tag
              >
            </el-dropdown-item>
            <el-divider class="dropdown-divider" />
            <el-dropdown-item command="logout">
              <font-awesome-icon icon="sign-out-alt" /> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 主题切换 -->
      <!-- <div class="nav-item theme-toggle" 
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
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.el-popper.is-light {
  background-color: #1a1a1a;
}

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

/* 左侧区域样式优化 */
.nav-left {
  display: flex;
  align-items: center;
  margin: 0 32px; /* 增加左右间距 */
}

/* 路径显示容器样式优化 */
.breadcrumb {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 20px; /* 增加内部间距 */
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 180px; /* 设置最小宽度 */
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(76, 175, 80, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

/* 图标容器样式优化 */
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px; /* 增加图标容器尺寸 */
  height: 36px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 10px;
  flex-shrink: 0; /* 防止图标被压缩 */
  transition: all 0.3s ease;

  .nav-icon {
    color: #4caf50;
    font-size: 18px;
    filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba(76, 175, 80, 0.15);
    transform: scale(1.05);

    .nav-icon {
      transform: scale(1.1);
    }
  }
}

/* 路径��字容式优化 */
.path-container {
  position: relative;
  overflow: hidden;
  padding: 4px 0;
  flex: 1; /* 让文字容器占据剩余空间 */
}

.path-text {
  color: #e5e5e5;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: none; /* 移除最大宽度限制 */
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
    content: "";
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
      color: #4caf50;
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
      border-color: #4caf50;
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
  background: linear-gradient(45deg, #f7ba2a, #ffd700);
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
  color: #f7ba2a;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;

  .vip-icon {
    font-size: 12px;
    filter: drop-shadow(0 2px 4px rgba(247, 186, 42, 0.3));
  }
}

/* 通知中心样式优化 */
:deep(.notification-popover) {
  background: #1a1a1a !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(180deg, rgba(76, 175, 80, 0.05), transparent);
    pointer-events: none;
  }
}

.notification-panel {
  background: #1a1a1a;
}

.notification-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: #e5e5e5;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: "";
      display: block;
      width: 4px;
      height: 16px;
      background: linear-gradient(to bottom, #4caf50, #45a049);
      border-radius: 2px;
    }
  }
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
  background: #1a1a1a;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #4caf50;
    border-radius: 2px;
  }
}

.notification-item {
  padding: 16px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  margin-bottom: 8px;
  background: #1a1a1a;
  border: 1px solid transparent;

  &:hover {
    background: rgba(76, 175, 80, 0.05);
    border-color: rgba(76, 175, 80, 0.1);
    transform: translateX(4px);
  }

  &.unread {
    background: rgba(76, 175, 80, 0.02);
    border-left: 3px solid #4caf50;

    .notification-icon {
      animation: pulse 2s infinite;
    }
  }
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;

  &.success {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }

  &.info {
    background: rgba(64, 158, 255, 0.1);
    color: #409eff;
  }

  &.warning {
    background: rgba(230, 162, 60, 0.1);
    color: #e6a23c;
  }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  color: #e5e5e5;
  font-size: 14px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  .unread-tag {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    background: linear-gradient(45deg, #4caf50, #45a049);
    border: none;
  }
}

.notification-desc {
  color: #999;
  font-size: 13px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.notification-time {
  color: #666;
  font-size: 12px;
}

.notification-footer {
  padding: 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  background: #1a1a1a;

  .el-button {
    color: #4caf50;
    font-size: 13px;

    &:hover {
      color: #45a049;
      transform: translateX(4px);
    }

    .fa-icon {
      margin-left: 4px;
      transition: transform 0.3s ease;
    }

    &:hover .fa-icon {
      transform: translateX(4px);
    }
  }
}

.mark-read-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  color: #4caf50;

  .mark-icon {
    transition: transform 0.3s ease;
  }

  &:not(:disabled):hover {
    color: #45a049;

    .mark-icon {
      transform: rotate(-15deg) scale(1.2);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* 空状态样式 */
.empty-notifications {
  padding: 40px 20px;
  text-align: center;
  color: #666;

  .fa-icon {
    font-size: 24px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

/* 动画效果 */
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

/* 响应式适配 */
@media (max-width: 768px) {
  .notification-panel {
    width: 300px;
  }

  .notification-item {
    padding: 12px;
  }

  .notification-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}

/* 其他样式保持不变... */
</style>