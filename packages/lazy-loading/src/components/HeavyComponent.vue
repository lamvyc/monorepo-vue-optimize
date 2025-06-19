<template>
  <div class="heavy-component">
    <h3>{{ title }}</h3>
    <div class="content">
      <div v-for="item in computedData" :key="item.id" class="item">
        <span>{{ item.name }}</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  data: Array<{ id: number; name: string; value: number }>
}>()

// 模拟耗时计算
const computedData = computed(() => {
  console.log('Heavy computation started...')
  const start = performance.now()
  
  // 模拟复杂计算
  const result = props.data.map(item => {
    let sum = 0
    for (let i = 0; i < 100000; i++) {
      sum += Math.random()
    }
    return {
      ...item,
      value: item.value + sum
    }
  })
  
  const end = performance.now()
  console.log(`Heavy computation finished in ${end - start}ms`)
  return result
})
</script>

<style scoped>
.heavy-component {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin: 10px 0;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.item {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}
</style> 