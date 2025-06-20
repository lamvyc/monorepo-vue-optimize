<template>
  <div
    v-show="visible"
    class="back-to-top"
    @click="scrollToTop"
    :style="{ bottom: offset + 'px', right: right + 'px' }"
  >
    <el-icon :size="20"><Top /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Top } from '@element-plus/icons-vue';

const props = withDefaults(
  defineProps<{
    visibilityHeight?: number;
    right?: number;
    offset?: number;
    duration?: number;
  }>(),
  {
    visibilityHeight: 400,
    right: 40,
    offset: 40,
    duration: 300,
  },
);

const visible = ref(false);

// 节流函数
const throttle = (fn: Function, delay: number) => {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
};

// 检查是否显示按钮
const checkScroll = () => {
  visible.value = window.pageYOffset > props.visibilityHeight;
};

// 滚动到顶部
const scrollToTop = () => {
  const startPosition = window.pageYOffset;
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / props.duration, 1);

    // easeInOutQuad 缓动函数
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    window.scrollTo(0, startPosition * (1 - ease(progress)));

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

// 添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', throttle(checkScroll, 200));
});

// 移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', throttle(checkScroll, 200));
});
</script>

<style scoped>
.back-to-top {
  position: fixed;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--el-color-primary);
  color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.back-to-top:hover {
  background-color: var(--el-color-primary-light-3);
  transform: translateY(-2px);
}
</style>
