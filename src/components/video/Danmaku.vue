<template>
  <div class="danmaku-container">
    <div class="danmaku-input">
      <el-input
        v-model="danmakuText"
        placeholder="发送弹幕..."
        :maxlength="50"
        clearable
      >
        <template #append>
          <el-button 
            type="primary"
            :disabled="!danmakuText.trim()"
            @click="sendDanmaku"
          >
            发送
          </el-button>
        </template>
      </el-input>
      <div class="danmaku-settings">
        <el-color-picker
          v-model="danmakuColor"
          size="small"
          show-alpha
        />
        <el-select v-model="danmakuMode" size="small">
          <el-option label="滚动" value="scroll" />
          <el-option label="顶部" value="top" />
          <el-option label="底部" value="bottom" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const danmakuText = ref('')
const danmakuColor = ref('#ffffff')
const danmakuMode = ref('scroll')

const sendDanmaku = () => {
  // 发送弹幕的逻辑
  console.log({
    text: danmakuText.value,
    color: danmakuColor.value,
    mode: danmakuMode.value
  })
  danmakuText.value = ''
}
</script>

<style scoped>
.danmaku-container {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
}

.danmaku-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.danmaku-settings {
  display: flex;
  gap: 8px;
}
</style> 