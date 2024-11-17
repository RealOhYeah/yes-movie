<script setup>
import { RouterLink } from 'vue-router'
import { MENU_ITEMS } from '@/utils/constants'
import logo from '@/assets/images/logo.svg'
</script>

<template>
  <div class="sidebar-wrapper">
    <div class="sidebar">
      <img :src="logo" alt="Logo" class="logo">
      <nav>
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
  align-items: center;
  padding-top: 20px;
  overflow-y: auto;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 40px;
  margin-bottom: 20px;
  filter: brightness(1.2);
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
}

.nav-item:hover {
  background-color: #4CAF50;
  color: #ffffff;
}

.nav-item.router-link-active {
  background-color: #4CAF50;
  color: #ffffff;
}

.font-awesome-icon {
  margin-bottom: 4px;
  font-size: 16px;
}

nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 自定义滚动条样式 */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}
</style> 