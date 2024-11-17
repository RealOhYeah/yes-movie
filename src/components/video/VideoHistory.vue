<template>
  <el-drawer
    v-model="visible"
    title="播放历史"
    direction="rtl"
    size="400px"
  >
    <div class="history-container">
      <el-empty v-if="!historyList.length" description="暂无观看记录" />
      <div v-else class="history-list">
        <div v-for="item in historyList" :key="item.id" class="history-item">
          <el-image
            :src="item.image"
            :alt="item.title"
            class="history-image"
            fit="cover"
          >
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="history-info">
            <h4>{{ item.title }}</h4>
            <p class="progress">观看至 {{ item.progress }}</p>
            <p class="time">{{ item.watchTime }}</p>
          </div>
          <div class="history-actions">
            <el-button 
              type="primary" 
              link 
              @click="continueWatch(item.id)"
            >
              继续观看
            </el-button>
            <el-button 
              type="danger" 
              link 
              @click="removeHistory(item.id)"
            >
              删除记录
            </el-button>
          </div>
        </div>
      </div>
      <div class="history-footer">
        <el-button type="danger" @click="clearHistory">
          清空历史记录
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const visible = ref(false)
const historyList = ref([
  {
    id: 1,
    title: '流浪地球2',
    image: 'https://image.tmdb.org/t/p/w500/pR858ihc6Ls9xohpdRJVjV787ml.jpg',
    progress: '01:23:45',
    watchTime: '2024-03-18 15:30'
  },
  // 更多历史记录...
])

const continueWatch = (id) => {
  router.push({
    name: 'video',
    params: { id }
  })
  visible.value = false
}

const removeHistory = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条观看记录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    historyList.value = historyList.value.filter(item => item.id !== id)
  } catch {
    // 用户取消删除
  }
}

const clearHistory = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有观看记录吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    historyList.value = []
  } catch {
    // 用户取消清空
  }
}

// 暴露方法给父组件
defineExpose({
  show: () => visible.value = true
})
</script>

<style scoped>
.history-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.history-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.history-image {
  width: 120px;
  height: 68px;
  border-radius: 4px;
  overflow: hidden;
}

.history-info {
  flex: 1;
}

.history-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.progress {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin: 0 0 4px 0;
}

.time {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin: 0;
}

.history-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-footer {
  padding: 20px;
  text-align: center;
  border-top: 1px solid var(--el-border-color-lighter);
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
}
</style> 