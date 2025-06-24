# 资源压缩演示

这个项目演示了在Vue3项目中使用Vite进行资源压缩的几种方式：

## 功能特性

1. **图片压缩**
   - 使用 `vite-plugin-imagemin` 插件
   - 支持 JPG、PNG、GIF、SVG 等格式
   - 可配置压缩质量和优化级别

2. **Gzip压缩**
   - 使用 `vite-plugin-compression` 插件
   - 自动对构建产物进行gzip压缩
   - 可配置压缩阈值和算法

3. **代码分割**
   - 基于路由的代码分割
   - 第三方库单独打包
   - 自定义分包策略

## 安装依赖

```bash
pnpm install
```

## 开发服务器

```bash
pnpm dev
```

## 构建

```bash
pnpm build
```

## 预览构建结果

```bash
pnpm preview
```

## 配置说明

### 图片压缩配置

在 `vite.config.ts` 中配置 `viteImagemin` 插件：

```typescript
viteImagemin({
  gifsicle: {
    optimizationLevel: 7,
    interlaced: false,
  },
  optipng: {
    optimizationLevel: 7,
  },
  mozjpeg: {
    quality: 80,
  },
  pngquant: {
    quality: [0.8, 0.9],
    speed: 4,
  },
  svgo: {
    plugins: [
      {
        name: 'removeViewBox',
      },
      {
        name: 'removeEmptyAttrs',
        active: false,
      },
    ],
  },
})
```

### Gzip压缩配置

```typescript
viteCompression({
  verbose: true,
  disable: false,
  threshold: 10240,
  algorithm: 'gzip',
  ext: '.gz',
})
```

### 代码分割配置

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'element-plus': ['element-plus'],
        'vue-vendor': ['vue', 'vue-router'],
      },
    },
  },
}
```

## 注意事项

1. 图片压缩可能需要安装额外的系统依赖
2. Gzip压缩需要服务器配置支持
3. 代码分割策略需要根据实际项目情况调整 