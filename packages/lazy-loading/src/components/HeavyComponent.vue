<template>
  <div class="heavy-component">
    <div class="charts-container">
      <div v-for="(chart, index) in charts" :key="index" class="chart-wrapper">
        <h3>{{ chart.title }}</h3>
        <div class="chart-content">
          <div 
            v-for="(item, itemIndex) in chart.data" 
            :key="itemIndex"
            class="chart-bar"
            :style="{ 
              width: item.value + '%',
              backgroundColor: getRandomColor()
            }"
          >
            {{ item.label }}: {{ item.value }}%
          </div>
        </div>
      </div>
    </div>

    <div class="data-grid">
      <div v-for="(row, rowIndex) in gridData" :key="rowIndex" class="data-row">
        <div 
          v-for="(cell, cellIndex) in row" 
          :key="cellIndex"
          class="data-cell"
          :style="{ backgroundColor: getRandomColor(0.1) }"
        >
          {{ cell }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 生成随机图表数据
const generateChartData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 100)
  }))
}

// 生成多个图表
const charts = ref([
  { title: '性能指标', data: generateChartData(8) },
  { title: '资源使用', data: generateChartData(6) },
  { title: '用户统计', data: generateChartData(10) }
])

// 生成网格数据
const gridData = ref(
  Array.from({ length: 20 }, (_, i) => 
    Array.from({ length: 5 }, (_, j) => 
      `Data ${i * 5 + j + 1}`
    )
  )
)

// 生成随机颜色
const getRandomColor = (alpha = 0.6) => {
  const hue = Math.floor(Math.random() * 360)
  return `hsla(${hue}, 70%, 50%, ${alpha})`
}

// 模拟组件初始化延迟
onMounted(() => {
  // 这里可以添加实际的初始化逻辑
  console.log('Heavy component mounted')
})
</script>

<style scoped>
.heavy-component {
  padding: 20px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-wrapper {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-content {
  margin-top: 15px;
}

.chart-bar {
  height: 30px;
  margin: 8px 0;
  padding: 0 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 14px;
  transition: width 0.3s ease;
}

.data-grid {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.data-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-bottom: 1px solid #eee;
}

.data-row:last-child {
  border-bottom: none;
}

.data-cell {
  padding: 12px;
  text-align: center;
  border-right: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.data-cell:last-child {
  border-right: none;
}

h3 {
  margin: 0 0 15px 0;
  color: var(--el-text-color-primary);
}
</style> 