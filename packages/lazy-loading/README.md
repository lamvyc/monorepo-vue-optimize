# Vue3 懒加载优化示例

本项目展示了 Vue3 中两种常见的懒加载优化技术：组件懒加载和图片懒加载。

## 1. 组件懒加载实现

组件懒加载利用了 Vue3 的 `defineAsyncComponent` 和 `Suspense` 组件来实现代码分割和异步加载。

### 核心实现

```typescript
// 1. 使用 defineAsyncComponent 定义异步组件
const AsyncHeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)

// 2. 使用 Suspense 包裹异步组件
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
```

### 优化效果

- 初始加载时不会加载大型组件的代码
- 组件会被单独打包成独立的 chunk
- 只有在需要时才会加载组件代码
- 加载过程中显示骨架屏占位

## 2. 图片懒加载实现

图片懒加载使用了 Intersection Observer API，通过自定义的组合式函数 `useIntersectionObserver` 实现。

### 核心实现

```typescript
// 1. useIntersectionObserver 组合式函数
export function useIntersectionObserver(
  elementRef: Ref<Element | null>,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  },
) {
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (!elementRef.value) return;
    observer = new IntersectionObserver(callback, options);
    observer.observe(elementRef.value);
  });

  const stop = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  return { stop };
}

// 2. LazyImage 组件中的使用
const { stop } = useIntersectionObserver(imageRef, ([entry]) => {
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
```

### 优化效果

- 图片只在进入视口时才开始加载
- 减少初始页面加载时的资源请求
- 节省带宽和提高页面加载速度
- 加载过程中显示骨架屏
- 支持加载失败的错误处理

## 使用方式

### 组件懒加载

```vue
<template>
  <div class="section">
    <el-button @click="loadHeavyComponent" :loading="isLoading">
      {{ isComponentLoaded ? '切换显示/隐藏' : '加载大型组件' }}
    </el-button>
    <Suspense v-if="showComponent">
      <!-- 组件内容 -->
    </Suspense>
  </div>
</template>
```

### 图片懒加载

```vue
<template>
  <LazyImage :src="imageUrl" :alt="imageAlt" />
</template>
```

## 注意事项

1. 组件懒加载

   - 确保使用 `Suspense` 组件包裹异步组件
   - 提供合适的加载占位内容
   - 考虑加载失败的处理

2. 图片懒加载
   - 确保提供合适的图片容器尺寸
   - 处理图片加载失败的情况
   - 考虑移动端的性能优化

## 性能提示

- 组件懒加载适用于较大的组件或不是首屏必需的组件
- 图片懒加载特别适合长列表或图片画廊场景
- 合理设置 Intersection Observer 的 rootMargin 可以提供更好的用户体验
