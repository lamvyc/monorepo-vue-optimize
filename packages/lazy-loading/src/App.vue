<template>
  <div class="container">
    <h1>懒加载优化示例</h1>

    <el-tabs v-model="activeTab" class="demo-tabs">
      <el-tab-pane label="组件懒加载" name="component">
        <div class="section">
          <p>点击下方按钮加载大型组件，观察网络面板中的 chunk 加载情况：</p>
          <div class="button-group">
            <el-button @click="loadHeavyComponent" :loading="isLoading" type="primary">
              {{ isComponentLoaded ? '切换显示/隐藏' : '加载大型组件' }}
            </el-button>
            <el-button @click="resetComponent" v-if="isComponentLoaded"> 重置组件 </el-button>
          </div>

          <Suspense v-if="showComponent">
            <template #default>
              <component :is="AsyncHeavyComponent" />
            </template>
            <template #fallback>
              <div class="loading-placeholder">
                <el-skeleton :rows="10" animated />
              </div>
            </template>
          </Suspense>
        </div>
      </el-tab-pane>

      <el-tab-pane label="图片懒加载" name="images">
        <div class="section">
          <p>滚动页面查看图片懒加载效果：</p>
          <div class="image-container">
            <template v-for="(image, index) in images" :key="index">
              <LazyImage :src="image" :alt="'Image ' + (index + 1)" class="lazy-image" />
            </template>
          </div>

          <div class="load-more-container">
            <el-button type="primary" @click="loadMore" :loading="isLoadingMore">
              加载更多图片
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import LazyImage from './components/LazyImage.vue';

const activeTab = ref('component');

// 使用 defineAsyncComponent 定义异步组件
const AsyncHeavyComponent = defineAsyncComponent(() => import('./components/HeavyComponent.vue'));

const isLoading = ref(false);
const isComponentLoaded = ref(false);
const showComponent = ref(false);

const loadHeavyComponent = async () => {
  if (isComponentLoaded.value) {
    // 如果组件已加载，则切换显示/隐藏
    showComponent.value = !showComponent.value;
    return;
  }

  isLoading.value = true;
  try {
    // 标记组件为已加载状态
    isComponentLoaded.value = true;
    showComponent.value = true;
  } catch (error) {
    console.error('Failed to load component:', error);
  } finally {
    isLoading.value = false;
  }
};

const resetComponent = () => {
  isComponentLoaded.value = false;
  showComponent.value = false;
};

// 图片数组
const images = ref([
  'https://picsum.photos/800/400?random=1',
  'https://picsum.photos/800/400?random=2',
  'https://picsum.photos/800/400?random=3',
  'https://picsum.photos/800/400?random=4',
  'https://picsum.photos/800/400?random=5',
]);

const isLoadingMore = ref(false);

const loadMore = async () => {
  isLoadingMore.value = true;
  // 模拟加载延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 添加新的图片
  const startIndex = images.value.length + 1;
  const newImages = Array.from(
    { length: 5 },
    (_, i) => `https://picsum.photos/800/400?random=${startIndex + i}`,
  );

  images.value.push(...newImages);
  isLoadingMore.value = false;
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  position: relative;
  padding-bottom: 80px; /* 为固定按钮留出空间 */
}

.section {
  margin: 20px 0;
}

h1 {
  margin-bottom: 30px;
  color: var(--el-text-color-primary);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.image-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.lazy-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.loading-placeholder {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  background: var(--el-bg-color);
}

/* 固定加载更多按钮到底部 */
.load-more-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.demo-tabs {
  margin-top: 20px;
}

/* 调整 tab 内容区域的样式 */
:deep(.el-tabs__content) {
  padding: 20px;
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
