<template>
  <div class="lazy-image" ref="imageRef">
    <div v-if="loading" class="loading-placeholder">
      <el-skeleton :rows="3" animated />
    </div>
    <img v-show="!loading" :src="src" @load="onImageLoad" @error="onImageError" />
    <div v-if="error" class="error-message">加载失败</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';

const props = defineProps<{
  src: string;
}>();

const loading = ref(true);
const error = ref(false);
const imageRef = ref<HTMLElement | null>(null);

const onImageLoad = () => {
  loading.value = false;
};

const onImageError = () => {
  loading.value = false;
  error.value = true;
};

const { stop } = useIntersectionObserver(imageRef, ([entry]) => {
  /* ✅ 为什么 entry.isIntersecting 能代表“是否进入视口”？
   * 因为 entry 是 IntersectionObserver 提供的一个对象，它代表某个被观察的元素与视口的交叉信息
   * entry.isIntersecting 是一个布尔值，表示被观察的元素当前是否与根容器（默认是浏览器视口）发生了交叉（intersection）。
   * true：说明元素已经进入了视口（或交叉区域）；false：说明元素当前完全不在视口内。
   */
  if (entry.isIntersecting) {
    // 图片进入视口时才开始加载
    const img = entry.target.querySelector('img');
    if (img && !img.src) {
      img.src = props.src;
    }
    // 停止观察
    stop();
  }
});

onUnmounted(() => {
  stop();
});
</script>

<style scoped>
.lazy-image {
  width: 100%;
  min-height: 200px;
  position: relative;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

.loading-placeholder {
  padding: 20px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #f56c6c;
  font-size: 14px;
}
</style>
