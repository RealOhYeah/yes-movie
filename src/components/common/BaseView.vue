<template>
  <div class="base-view">
    <h1>{{ title }}</h1>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.base-view {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #e5e5e5;
}
</style> 