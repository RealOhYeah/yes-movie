<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import TopNav from '@/components/layout/TopNav.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template>
  <div class="app-container">
    <el-container class="main-container">
      <el-aside width="auto" class="sidebar-container">
        <Sidebar />
      </el-aside>
      <el-container class="content-container">
        <el-header class="header-container">
          <TopNav />
        </el-header>
        <el-main class="main-content">
          <router-view />
          <Footer />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  overflow-x: hidden;
}

.main-container {
  min-height: 100vh;
}

.sidebar-container {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background-color: #2d2d2d;
}

.content-container {
  margin-left: 64px; /* Sidebar 宽度 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-container {
  position: sticky;
  top: 0;
  z-index: 999;
  padding: 0;
  height: 64px;
  background-color: #2d2d2d;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #1a1a1a;
  min-height: calc(100vh - 64px); /* 减去 header 高度 */
  box-sizing: border-box;
}

/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .content-container {
    margin-left: 50px;
  }
  
  .main-content {
    padding: 10px;
  }
}

/* 滚动条样式 */
:deep(*::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(*::-webkit-scrollbar-track) {
  background: #2d2d2d;
  border-radius: 3px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: #4CAF50;
  border-radius: 3px;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: #45a049;
}
</style>
