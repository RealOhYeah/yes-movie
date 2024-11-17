<script setup>
import { RouterLink } from 'vue-router'
import { MENU_ITEMS } from '@/utils/constants'
import logo from '@/assets/images/logo.svg'
</script>

<template>
  <div class="sidebar-wrapper">
    <div class="sidebar" :class="{ collapsed: isCollapse }">
      <div class="logo-container">
        <div class="logo-wrapper" @click="$router.push('/')">
          <div class="logo-icon">
            <font-awesome-icon icon="play-circle" class="main-icon" />
            <div class="glow-effect"></div>
          </div>
          <transition name="fade">
            <span v-show="!isCollapse" class="logo-text">
              视频网站
              <div class="logo-badge">Beta</div>
            </span>
          </transition>
        </div>
        <div class="toggle-btn" @click="toggleCollapse">
          <font-awesome-icon :icon="isCollapse ? 'angle-right' : 'angle-left'" />
        </div>
      </div>
      <nav class="nav-menu">
        <RouterLink 
          v-for="item in MENU_ITEMS" 
          :key="item.path"
          :to="item.path" 
          class="nav-item"
        >
          <font-awesome-icon :icon="item.icon" />
          {{ item.title }}
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  width: 100px;
  height: 100vh;
  padding: 20px 0;
  background-color: #1a1a1a;
  position: fixed;
  left: 0;
  top: 0;
}

.sidebar {
  width: 80px;
  height: calc(100vh - 40px);
  background-color: #2d2d2d;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.logo-container {
  padding: 12px 8px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background-color: #2d2d2d;
  border-radius: 12px 12px 0 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 16px);
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }
}

.nav-menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 0;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 2px;
  }
  
  &:hover::-webkit-scrollbar-thumb {
    background: #4CAF50;
  }
}

.nav-item {
  color: #b3b3b3;
  text-decoration: none;
  padding: 12px 0;
  width: 100%;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: #4CAF50;
    transition: height 0.3s ease;
  }
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
    
    &::after {
      height: 60%;
    }
  }
  
  &.router-link-active {
    background-color: rgba(76, 175, 80, 0.15);
    color: #4CAF50;
    
    &::after {
      height: 60%;
    }
  }
  
  .fa-icon {
    font-size: 16px;
    margin-bottom: 4px;
  }
}

.logo-icon {
  position: relative;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  .main-icon {
    font-size: 20px;
    color: #e5e5e5;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
  }
  
  .glow-effect {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: radial-gradient(
      circle,
      rgba(76, 175, 80, 0.2),
      transparent 70%
    );
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
}

.logo-text {
  font-size: 14px;
  font-weight: 600;
  color: #e5e5e5;
  transition: color 0.3s ease;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.logo-badge {
  position: absolute;
  top: -6px;
  right: -16px;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 8px;
  transform: scale(0.8);
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.toggle-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  color: #999;
  transition: all 0.3s ease;
  font-size: 12px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #4CAF50;
    transform: scale(1.1);
  }
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .logo-container {
    padding: 0 8px;
  }
  
  .logo-icon {
    width: 28px;
    height: 28px;
    
    .main-icon {
      font-size: 20px;
    }
  }
  
  .toggle-btn {
    width: 20px;
    height: 20px;
  }
}
</style> 