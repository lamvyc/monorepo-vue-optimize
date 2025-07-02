<template>
  <div>
    <canvas ref="canvas" width="800" height="400"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);

defineOptions({ name: 'HeavyChart' });

// 调试日志：记录组件挂载/卸载
onMounted(() => {
  console.log('%cHeavyChart mounted', 'color:green');
});

onUnmounted(() => {
  console.log('%cHeavyChart unmounted', 'color:red');
});

// 添加额外的耗时 CPU 操作以放大重渲染差异
function heavyComputation() {
  const start = performance.now();
  let sum = 0;
  for (let i = 0; i < 5e7; i++) {
    sum += Math.sqrt(i);
  }
  const end = performance.now();
  console.log(`Heavy computation took ${Math.round(end - start)} ms`, sum);
}

// 在组件首次挂载时绘制大量图形，模拟沉重的渲染逻辑
onMounted(() => {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    const width = canvas.value.width;
    const height = canvas.value.height;

    // 绘制 20000 个随机小矩形
    for (let i = 0; i < 20000; i++) {
      ctx.fillStyle = `hsl(${i % 360}, 60%, 60%)`;
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillRect(x, y, 4, 4);
    }

    // 执行耗时计算
    heavyComputation();
  }
});
</script> 