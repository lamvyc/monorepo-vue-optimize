<template>
  <div class="lazy-image" ref="imageRef">
    <div v-if="loading" class="loading-placeholder">
      <el-skeleton :rows="3" animated />
    </div>
    <img v-show="!loading" :src="src" @load="onImageLoad" @error="onImageError" />
    <div v-if="error" class="error-message">
      加载失败
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useIntersectionObserver } from '../composables/useIntersectionObserver'

const props = defineProps<{
  src: string
}>()

const loading = ref(true)
const error = ref(false)
const imageRef = ref<HTMLElement | null>(null)

const onImageLoad = () => {
  loading.value = false
}

const onImageError = () => {
  loading.value = false
  error.value = true
}

const { stop } = useIntersectionObserver(imageRef, ([entry]) => {
  if (entry.isIntersecting) {
    // 图片进入视口时才开始加载
    const img = entry.target.querySelector('img')
    if (img && !img.src) {
      img.src = props.src
    }
    // 停止观察
    stop()
  }
})

onUnmounted(() => {
  stop()
})
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