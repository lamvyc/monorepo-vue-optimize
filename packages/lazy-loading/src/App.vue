<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="图片懒加载" name="images">
        <div class="image-grid">
          <lazy-image v-for="(url, index) in imageUrls" :key="index" :src="url" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="组件懒加载" name="components">
        <div class="components-container">
          <el-button @click="loadMore">加载更多数据</el-button>
          <Suspense>
            <template #default>
              <div class="heavy-components">
                <AsyncHeavyComponent
                  v-for="(item, index) in heavyComponentsData"
                  :key="index"
                  :title="item.title"
                  :data="item.data"
                />
              </div>
            </template>
            <template #fallback>
              <div class="loading">
                <el-skeleton :rows="5" animated />
              </div>
            </template>
          </Suspense>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import LazyImage from './components/LazyImage.vue'

// 异步导入重型组件
const AsyncHeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)

const activeTab = ref('images')

// 模拟图片URL列表
const imageUrls = ref([
  'https://picsum.photos/800/400?random=1',
  'https://picsum.photos/800/400?random=2',
  'https://picsum.photos/800/400?random=3',
  'https://picsum.photos/800/400?random=4',
  'https://picsum.photos/800/400?random=5',
  'https://picsum.photos/800/400?random=6',
])

// 模拟重型组件数据
const heavyComponentsData = ref([
  {
    title: '数据集 1',
    data: Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000
    }))
  }
])

const loadMore = () => {
  const newIndex = heavyComponentsData.value.length + 1
  heavyComponentsData.value.push({
    title: `数据集 ${newIndex}`,
    data: Array.from({ length: 10 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000
    }))
  })
}
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.components-container {
  padding: 20px 0;
}

.heavy-components {
  margin-top: 20px;
}

.loading {
  padding: 20px;
}
</style> 