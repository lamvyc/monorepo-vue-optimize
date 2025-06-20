# Monorepo Vue 项目指南

## 如何在 packages 中新增子项目

### 1. 创建新的子项目

1. 在 `packages` 目录下创建新的项目文件夹，例如 `my-new-feature`

2. 初始化项目基本结构：

```bash
cd packages/my-new-feature
pnpm init
```

3. 添加必要的依赖到 `package.json`：

```json
{
  "name": "@monorepo-vue/my-new-feature",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.0"
  }
}
```

4. 创建 TypeScript 配置文件 `tsconfig.json`：

```json
{
  "extends": "../../core/ts-config/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"],
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

5. 创建 Vite 配置文件 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

6. 创建基本的项目结构：

```
src/
  ├── App.vue
  ├── main.ts
  ├── env.d.ts
  └── components/
```

### 2. 在 main-app 中集成新子项目

1. 在 `apps/main-app/package.json` 中添加依赖：

```json
{
  "dependencies": {
    "@monorepo-vue/my-new-feature": "workspace:*"
  }
}
```

2. 在路由配置文件 `apps/main-app/src/router/index.ts` 中添加新路由：

```typescript
{
  path: '/my-new-feature',
  name: 'MyNewFeature',
  component: () => import('./MyNewFeature.vue')
}
```

3. 在 `apps/main-app/src/router/` 目录下创建对应的视图组件（例如 `MyNewFeature.vue`）：

```vue
<template>
  <div class="my-new-feature">
    <!-- 引入子项目的组件 -->
    <my-new-feature-component />
  </div>
</template>

<script setup lang="ts">
import { MyNewFeatureComponent } from '@monorepo-vue/my-new-feature';
</script>
```

4. 在导航组件 `apps/main-app/src/components/Navigation.vue` 中添加新的导航链接：

```vue
<router-link to="/my-new-feature">My New Feature</router-link>
```

## 注意事项

1. 确保新子项目的名称在 `package.json` 中使用 `@monorepo-vue` 作为命名空间前缀
2. 子项目的 TypeScript 配置应该继承自 `core/ts-config/tsconfig.base.json`
3. 在主应用中引入子项目时，使用 `workspace:*` 作为版本号
4. 安装依赖后需要执行 `pnpm install` 更新依赖关系

## 开发流程

1. 在子项目目录下运行开发服务器：

```bash
cd packages/my-new-feature
pnpm dev
```

2. 在主应用中运行开发服务器：

```bash
cd apps/main-app
pnpm dev
```

## 构建

在根目录执行以下命令构建所有项目：

```bash
pnpm build
```

或者单独构建特定项目：

```bash
pnpm --filter @monorepo-vue/my-new-feature build
```
