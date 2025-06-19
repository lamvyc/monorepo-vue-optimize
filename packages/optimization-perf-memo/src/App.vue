<template>
  <div class="app">
    <h1>Vue3 性能优化 - v-memo 指令示例</h1>
    <p class="description">
      本示例展示了 v-memo 在大量列表数据更新时的性能优化效果。左侧为普通渲染，右侧使用 v-memo 优化。
      当更新时间戳时，v-memo 版本将跳过不必要的重渲染。
    </p>
    <MemoList />
  </div>
</template>

<script setup lang="ts">
import MemoList from './components/MemoList.vue'
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  color: #409EFF;
  text-align: center;
}

.description {
  max-width: 800px;
  margin: 20px auto;
  color: #666;
  line-height: 1.6;
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}
</style> 